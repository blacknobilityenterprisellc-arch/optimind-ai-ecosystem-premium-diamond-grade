import { secureStorage } from './secure-storage';

export interface StoredPhoto {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: string;
  fileSize: number;
  confidence?: number;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
  syncStatus: "synced" | "pending" | "failed";
  lastSyncAttempt?: string;
}

export interface SyncQueueItem {
  id: string;
  type: "create" | "update" | "delete";
  photoId: string;
  data: StoredPhoto;
  timestamp: string;
  retryCount: number;
}

export interface UserPreferences {
  autoSync: boolean;
  syncOnWifiOnly: boolean;
  maxOfflineStorage: number; // in MB
  compressionQuality: number; // 0-1
  deleteFlaggedPhotos: boolean;
  notifications: {
    scanComplete: boolean;
    syncComplete: boolean;
    newPhotos: boolean;
  };
  filterSettings: {
    showSafe: boolean;
    showFlagged: boolean;
    showPending: boolean;
    showScanning: boolean;
    confidenceThreshold: number;
    autoHideFlagged: boolean;
    categories: string[];
    excludedCategories: string[];
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  autoSync: true,
  syncOnWifiOnly: false,
  maxOfflineStorage: 500, // 500MB
  compressionQuality: 0.8,
  deleteFlaggedPhotos: false,
  notifications: {
    scanComplete: true,
    syncComplete: true,
    newPhotos: true,
  },
  filterSettings: {
    showSafe: true,
    showFlagged: true,
    showPending: true,
    showScanning: true,
    confidenceThreshold: 0,
    autoHideFlagged: false,
    categories: [],
    excludedCategories: [],
  },
};

const STORAGE_KEYS = {
  PHOTOS: "private_photo_guardian_photos",
  SYNC_QUEUE: "private_photo_guardian_sync_queue",
  PREFERENCES: "private_photo_guardian_preferences",
  OFFLINE_MODE: "private_photo_guardian_offline_mode",
};

class OfflineStorage {
  private isOnline: boolean = true;

  constructor() {
    // Initialize online status
    this.updateOnlineStatus();
    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.updateOnlineStatus());
      window.addEventListener("offline", () => this.updateOnlineStatus());
    }
  }

  private updateOnlineStatus() {
    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  }

  // Photo Management
  async savePhoto(photo: Omit<StoredPhoto, "createdAt" | "updatedAt" | "syncStatus">): Promise<StoredPhoto> {
    const storedPhoto: StoredPhoto = {
      ...photo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: this.isOnline ? "synced" : "pending",
    };

    const photos = await this.getPhotos();
    const existingIndex = photos.findIndex(p => p.id === photo.id);
    
    if (existingIndex >= 0) {
      // Update existing photo
      photos[existingIndex] = { ...photos[existingIndex], ...storedPhoto };
      await this.addToSyncQueue("update", storedPhoto);
    } else {
      // Add new photo
      photos.push(storedPhoto);
      await this.addToSyncQueue("create", storedPhoto);
    }

    await this.setPhotos(photos);
    return storedPhoto;
  }

  async getPhotos(): Promise<StoredPhoto[]> {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = await secureStorage.getItem<StoredPhoto[]>(STORAGE_KEYS.PHOTOS);
      return stored || [];
    } catch (error) {
      console.error("Error loading photos from secure storage:", error);
      return [];
    }
  }

  async setPhotos(photos: StoredPhoto[]): Promise<void> {
    if (typeof window === "undefined") return;
    
    try {
      await secureStorage.setItem(STORAGE_KEYS.PHOTOS, photos);
    } catch (error) {
      console.error("Error saving photos to secure storage:", error);
      throw new Error("Storage quota exceeded");
    }
  }

  async deletePhoto(photoId: string): Promise<void> {
    const photos = await this.getPhotos();
    const photoToDelete = photos.find(p => p.id === photoId);
    
    if (photoToDelete) {
      // Remove from photos
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      await this.setPhotos(updatedPhotos);
      
      // Add to sync queue
      await this.addToSyncQueue("delete", photoToDelete);
      
      // Clean up object URL if it exists
      if (photoToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(photoToDelete.url);
      }
    }
  }

  async updatePhotoStatus(
    photoId: string, 
    status: StoredPhoto["status"],
    updates: Partial<Pick<StoredPhoto, "confidence" | "categories" | "scanDate">> = {}
  ): Promise<void> {
    const photos = await this.getPhotos();
    const photoIndex = photos.findIndex(p => p.id === photoId);
    
    if (photoIndex >= 0) {
      photos[photoIndex] = {
        ...photos[photoIndex],
        status,
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: this.isOnline ? "synced" : "pending",
      };
      
      await this.setPhotos(photos);
      await this.addToSyncQueue("update", photos[photoIndex]);
    }
  }

  // Sync Queue Management
  private async addToSyncQueue(type: SyncQueueItem["type"], photo: StoredPhoto): Promise<void> {
    if (typeof window === "undefined") return;
    
    try {
      const queue = await this.getSyncQueue();
      const queueItem: SyncQueueItem = {
        id: `sync-${Date.now()}-${Math.random()}`,
        type,
        photoId: photo.id,
        data: photo,
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      
      queue.push(queueItem);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      
      // Attempt immediate sync if online
      if (this.isOnline) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error("Error adding to sync queue:", error);
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = await secureStorage.getItem<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE);
      return stored || [];
    } catch (error) {
      console.error("Error loading sync queue from secure storage:", error);
      return [];
    }
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isOnline) return;
    
    const preferences = await this.getPreferences();
    if (preferences.syncOnWifiOnly && !this.isWifiConnection()) {
      return;
    }

    const queue = await this.getSyncQueue();
    const processedItems: string[] = [];
    
    for (const item of queue) {
      try {
        // Simulate API call - in real implementation, this would call your backend
        await this.syncToServer(item);
        processedItems.push(item.id);
      } catch (error) {
        console.error(`Sync failed for item ${item.id}:`, error);
        
        // Update retry count
        item.retryCount++;
        if (item.retryCount >= 3) {
          // Max retries reached, mark as failed
          processedItems.push(item.id);
          
          // Update photo sync status
          const photos = await this.getPhotos();
          const photo = photos.find(p => p.id === item.photoId);
          if (photo) {
            photo.syncStatus = "failed";
            photo.lastSyncAttempt = new Date().toISOString();
            await this.setPhotos(photos);
          }
        }
      }
    }
    
    // Remove processed items from queue
    const updatedQueue = queue.filter(item => !processedItems.includes(item.id));
    await secureStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, updatedQueue);
  }

  private async syncToServer(item: SyncQueueItem): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would make actual API calls
    console.log(`Syncing ${item.type} operation for photo ${item.photoId}`);
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }
  }

  // User Preferences
  async getPreferences(): Promise<UserPreferences> {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    
    try {
      const stored = await secureStorage.getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES);
      const preferences = stored || DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...preferences };
    } catch (error) {
      console.error("Error loading preferences from secure storage:", error);
      return DEFAULT_PREFERENCES;
    }
  }

  async savePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const currentPrefs = await this.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    if (typeof window !== "undefined") {
      try {
        await secureStorage.setItem(STORAGE_KEYS.PREFERENCES, updatedPrefs);
      } catch (error) {
        console.error("Error saving preferences to secure storage:", error);
      }
    }
    
    return updatedPrefs;
  }

  // Storage Management
  async getStorageUsage(): Promise<{ used: number; total: number; photos: number }> {
    const photos = await this.getPhotos();
    const syncQueue = await this.getSyncQueue();
    const preferences = await this.getPreferences();
    
    // Calculate approximate storage usage
    const photosSize = JSON.stringify(photos).length;
    const queueSize = JSON.stringify(syncQueue).length;
    const prefsSize = JSON.stringify(preferences).length;
    
    const totalSize = photosSize + queueSize + prefsSize;
    const maxSize = preferences.maxOfflineStorage * 1024 * 1024; // Convert MB to bytes
    
    return {
      used: totalSize,
      total: maxSize,
      photos: photos.length,
    };
  }

  async cleanupStorage(): Promise<void> {
    const preferences = await this.getPreferences();
    const usage = await this.getStorageUsage();
    
    if (usage.used > usage.total) {
      // Remove oldest photos until under limit
      const photos = await this.getPhotos();
      const sortedPhotos = photos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      let currentUsage = usage.used;
      const photosToRemove: StoredPhoto[] = [];
      
      for (const photo of sortedPhotos) {
        if (currentUsage <= usage.total * 0.8) { // Clean up to 80% of limit
          break;
        }
        
        photosToRemove.push(photo);
        currentUsage -= JSON.stringify(photo).length;
      }
      
      // Remove photos from storage
      const updatedPhotos = photos.filter(p => !photosToRemove.some(r => r.id === p.id));
      await this.setPhotos(updatedPhotos);
      
      // Clean up object URLs
      photosToRemove.forEach(photo => {
        if (photo.url.startsWith("blob:")) {
          URL.revokeObjectURL(photo.url);
        }
      });
    }
  }

  // Utility Methods
  private isWifiConnection(): boolean {
    // This is a simplified check - in a real app, you'd use Network Information API
    return true;
  }

  async clearAllData(): Promise<void> {
    if (typeof window === "undefined") return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        secureStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing secure storage:", error);
    }
  }

  async exportData(): Promise<string> {
    const photos = await this.getPhotos();
    const syncQueue = await this.getSyncQueue();
    const preferences = await this.getPreferences();
    
    return JSON.stringify({
      photos,
      syncQueue,
      preferences,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  async importData(data: string): Promise<void> {
    try {
      const imported = JSON.parse(data);
      
      if (imported.photos) {
        await this.setPhotos(imported.photos);
      }
      
      if (imported.syncQueue) {
        await secureStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, imported.syncQueue);
      }
      
      if (imported.preferences) {
        await this.savePreferences(imported.preferences);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      throw new Error("Invalid data format");
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// React hook for offline storage
import { useState, useEffect } from "react";

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    savePhoto: offlineStorage.savePhoto.bind(offlineStorage),
    getPhotos: offlineStorage.getPhotos.bind(offlineStorage),
    deletePhoto: offlineStorage.deletePhoto.bind(offlineStorage),
    updatePhotoStatus: offlineStorage.updatePhotoStatus.bind(offlineStorage),
    getPreferences: offlineStorage.getPreferences.bind(offlineStorage),
    savePreferences: offlineStorage.savePreferences.bind(offlineStorage),
    getStorageUsage: offlineStorage.getStorageUsage.bind(offlineStorage),
    processSyncQueue: offlineStorage.processSyncQueue.bind(offlineStorage),
    clearAllData: offlineStorage.clearAllData.bind(offlineStorage),
    exportData: offlineStorage.exportData.bind(offlineStorage),
    importData: offlineStorage.importData.bind(offlineStorage),
  };
}
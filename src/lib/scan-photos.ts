// Client-side scanning using API endpoints
export interface ScanResult {
  photoId: string;
  isNsfw: boolean;
  confidence: number;
  categories: string[];
  analysis?: string;
}

export interface PhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  file?: File;
  confidence?: number;
  categories?: string[];
}

interface ProgressCallback {
  (progress: number, currentPhoto: string): void;
}

interface ScanRequest {
  photoId: string;
  imageData: string; // base64 encoded image
}

interface ScanResponse {
  photoId: string;
  isNsfw: boolean;
  confidence: number;
  categories?: string[];
  error?: string;
}

/**
 * Scan multiple photos for NSFW content using API
 */
export async function scanMultiplePhotos(
  photos: PhotoItem[],
  files: File[],
  onProgress?: ProgressCallback
): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const totalPhotos = photos.length;

  try {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const file = files[i];

      if (!file) {
        console.warn(`No file found for photo ${photo.id}`);
        continue;
      }

      try {
        // Update progress
        const progress = ((i + 1) / totalPhotos) * 100;
        if (onProgress) {
          onProgress(progress, photo.name);
        }

        // Convert file to base64 for API
        const base64Image = await fileToBase64(file);

        // Call the scan API
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photoId: photo.id,
            imageData: base64Image
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const apiResult: ScanResponse = await response.json();

        // Convert API response to ScanResult format
        const scanResult: ScanResult = {
          photoId: photo.id,
          isNsfw: apiResult.isNsfw,
          confidence: apiResult.confidence,
          categories: apiResult.categories || [],
          analysis: apiResult.error ? `Error: ${apiResult.error}` : 'AI analysis completed'
        };

        results.push(scanResult);

      } catch (error) {
        console.error(`Error scanning photo ${photo.name}:`, error);
        
        // Add a fallback result for failed scans
        results.push({
          photoId: photo.id,
          isNsfw: false,
          confidence: 0.5,
          categories: ["error"],
          analysis: "Scanning failed - please try again"
        });
      }
    }

    return results;

  } catch (error) {
    console.error("Error scanning photos:", error);
    throw new Error("Failed to scan photos");
  }
}

/**
 * Convert a File object to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part (remove data:image/type;base64, prefix)
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error("Failed to convert file to base64"));
        return;
      }
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Scan a single photo for NSFW content
 */
export async function scanSinglePhoto(
  photo: PhotoItem,
  file: File
): Promise<ScanResult> {
  const results = await scanMultiplePhotos([photo], [file]);
  return results[0];
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PremiumBadge } from "@/components/PremiumBadge";
import { 
  X, 
  Shield, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  Lock,
  Unlock,
  Key,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface VaultPhoto {
  id: string;
  name: string;
  url: string;
  isEncrypted: boolean;
  size: string;
  addedDate: string;
}

interface EncryptedVaultProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

export function EncryptedVault({ isOpen, onClose, isPremium = false }: EncryptedVaultProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [authMethod, setAuthMethod] = useState<"biometric" | "pin">("biometric");
  const [pin, setPin] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [vaultPhotos, setVaultPhotos] = useState<VaultPhoto[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Mock vault photos
  useEffect(() => {
    if (showVault) {
      setVaultPhotos([
        {
          id: "1",
          name: "family_vacation.jpg",
          url: "/api/placeholder/200/200",
          isEncrypted: true,
          size: "2.4 MB",
          addedDate: "2024-01-15"
        },
        {
          id: "2", 
          name: "birthday_party.jpg",
          url: "/api/placeholder/200/200",
          isEncrypted: true,
          size: "3.1 MB",
          addedDate: "2024-01-10"
        },
        {
          id: "3",
          name: "private_moment.jpg", 
          url: "/api/placeholder/200/200",
          isEncrypted: true,
          size: "1.8 MB",
          addedDate: "2024-01-05"
        }
      ]);
    }
  }, [showVault]);

  // Biometric scanning animation
  useEffect(() => {
    if (!isScanning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Outer ring
      ctx.beginPath();
      ctx.arc(100, 100, 80, 0, 2 * Math.PI);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Scanning arc
      ctx.beginPath();
      ctx.arc(100, 100, 80, angle - 0.5, angle + 0.5);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(100, 100, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();

      angle += 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning]);

  const handleBiometricAuth = async () => {
    setIsScanning(true);
    
    // Simulate biometric scanning
    setTimeout(() => {
      setIsScanning(false);
      setIsAuthenticated(true);
      setShowVault(true);
      
      // Simulate vault unlock
      setTimeout(() => {
        setIsUnlocked(true);
      }, 1000);
    }, 3000);
  };

  const handlePinAuth = () => {
    if (pin.length === 4) {
      // Simulate PIN verification
      if (pin === "1234") {
        setIsAuthenticated(true);
        setShowVault(true);
        setTimeout(() => {
          setIsUnlocked(true);
        }, 1000);
      } else {
        alert("Invalid PIN");
        setPin("");
      }
    }
  };

  const handlePinInput = (value: string) => {
    if (pin.length < 4) {
      setPin(pin + value);
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const lockVault = () => {
    setIsUnlocked(false);
    setShowVault(false);
    setIsAuthenticated(false);
    setPin("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40"
        >
          <X className="w-5 h-5" />
        </Button>

        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden">
          <CardContent className="p-0">
            {!isAuthenticated ? (
              // Authentication Screen
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Encrypted Vault
                  </h2>
                  
                  <p className="text-gray-400 mb-6">
                    Your private photos are secured with military-grade encryption
                  </p>

                  {!isPremium && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-6">
                      <PremiumBadge size="sm" text="PRO" />
                      <span className="text-yellow-400 text-sm">Premium Feature</span>
                    </div>
                  )}
                </div>

                {/* Authentication Method Selection */}
                <div className="flex justify-center gap-4 mb-8">
                  <Button
                    variant={authMethod === "biometric" ? "default" : "outline"}
                    onClick={() => setAuthMethod("biometric")}
                    className="flex items-center gap-2"
                  >
                    <Fingerprint className="w-4 h-4" />
                    Biometric
                  </Button>
                  <Button
                    variant={authMethod === "pin" ? "default" : "outline"}
                    onClick={() => setAuthMethod("pin")}
                    className="flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    PIN
                  </Button>
                </div>

                {/* Authentication Interface */}
                {authMethod === "biometric" ? (
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <canvas
                        ref={canvasRef}
                        width={200}
                        height={200}
                        className="absolute inset-0"
                      />
                      {isScanning ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Fingerprint className="w-16 h-16 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-400 mb-6">
                      {isScanning ? "Scanning fingerprint..." : "Place your finger on the sensor"}
                    </p>

                    <Button
                      onClick={handleBiometricAuth}
                      disabled={isScanning || !isPremium}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                    >
                      {isScanning ? "Scanning..." : "Authenticate with Biometric"}
                    </Button>

                    {!isPremium && (
                      <p className="text-sm text-gray-500 mt-4">
                        Biometric authentication requires a Premium subscription
                      </p>
                    )}
                  </div>
                ) : (
                  // PIN Authentication
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
                      <Key className="w-12 h-12 text-yellow-400" />
                    </div>

                    <p className="text-gray-400 mb-6">Enter your 4-digit PIN</p>

                    {/* PIN Display */}
                    <div className="flex justify-center gap-3 mb-8">
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center"
                        >
                          {showPassword ? (
                            <span className="text-white text-xl">{pin[index] || ""}</span>
                          ) : (
                            <div
                              className={`w-3 h-3 rounded-full ${
                                pin[index] ? "bg-yellow-400" : "bg-gray-600"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Show/Hide PIN Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mb-6 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPassword ? "Hide PIN" : "Show PIN"}
                    </Button>

                    {/* PIN Pad */}
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "delete"].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          onClick={() => {
                            if (num === "delete") {
                              handlePinDelete();
                            } else if (num !== "") {
                              handlePinInput(num.toString());
                            }
                          }}
                          disabled={num === ""}
                          className="h-12 bg-gray-800 border-gray-700 hover:bg-gray-700"
                        >
                          {num === "delete" ? <X className="w-4 h-4" /> : num}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={handlePinAuth}
                      disabled={pin.length !== 4}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                    >
                      Unlock Vault
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // Vault Content
              <div className="p-8">
                {/* Vault Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      {isUnlocked ? <Unlock className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Secure Vault</h2>
                      <p className="text-gray-400">
                        {isUnlocked ? "Unlocked and accessible" : "Decrypting contents..."}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={lockVault}
                    variant="outline"
                    className="text-gray-400 hover:text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock
                  </Button>
                </div>

                {/* Security Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">End-to-End Encrypted</span>
                    </div>
                    <p className="text-sm text-gray-400">Military-grade AES-256 encryption</p>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">Biometric Protected</span>
                    </div>
                    <p className="text-sm text-gray-400">Multi-factor authentication</p>
                  </div>

                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-medium">Cloud Backup</span>
                    </div>
                    <p className="text-sm text-gray-400">Secure cloud synchronization</p>
                  </div>
                </div>

                {/* Vault Photos */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Protected Photos ({vaultPhotos.length})</h3>
                  
                  {vaultPhotos.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No photos in vault yet</p>
                      <p className="text-sm">Add photos to keep them secure</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vaultPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Encryption indicator */}
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                                <Lock className="w-3 h-3 mr-1" />
                                Encrypted
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium truncate">{photo.name}</p>
                            <p className="text-xs text-gray-400">{photo.size} • {photo.addedDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
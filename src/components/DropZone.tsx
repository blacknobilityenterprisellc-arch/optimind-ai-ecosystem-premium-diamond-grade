"use client";

import { useCallback, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  FileImage, 
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileWithPreview extends File {
  preview: string;
}

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export function DropZone({ 
  onFilesAdded, 
  maxFiles = 50, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*"]
}: DropZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File ${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`;
    }

    // Check file type
    if (acceptedTypes.includes("image/*")) {
      if (!file.type.startsWith("image/")) {
        return `File ${file.name} is not a valid image type`;
      }
    }

    return null;
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Show errors
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: "Upload Error",
          description: error,
          variant: "destructive",
        });
      });
    }

    // Check max files
    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: "Upload Error",
        description: `Too many files. Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    if (validFiles.length > 0) {
      const filesWithPreview = validFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      setFiles(prev => [...prev, ...filesWithPreview]);
      
      // Simulate upload process
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Call the callback with the files
            onFilesAdded(validFiles);
            
            // Clear the files after successful upload
            setTimeout(() => setFiles([]), 1000);
            
            toast({
              title: "Upload Complete",
              description: `${validFiles.length} file(s) uploaded successfully`,
            });
            
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [files.length, maxFiles, maxSize, acceptedTypes, onFilesAdded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset the input value so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card 
        className={`
          transition-colors cursor-pointer
          ${isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Uploading Files...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please wait while we process your images
                </p>
              </div>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                {isDragActive ? (
                  <FileImage className="w-6 h-6 text-primary" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {isDragActive ? "Drop your images here" : "Upload Photos"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isDragActive 
                    ? "Release to upload your photos"
                    : "Drag & drop your photos here, or click to browse"
                  }
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">Max {maxFiles} files</Badge>
                <Badge variant="outline">Max {formatFileSize(maxSize)} per file</Badge>
                <Badge variant="outline">Images only</Badge>
              </div>
              <Button variant="outline" size="sm" className="mt-2" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Files to Upload</h4>
                <Badge variant="secondary">{files.length} file(s)</Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {isUploading && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing files...</span>
                    <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
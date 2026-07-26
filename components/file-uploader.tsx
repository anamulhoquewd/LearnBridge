'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CloudUpload, X } from 'lucide-react';
import { validateFiles, getFilePreviewUrl, formatFileSize, FileUploadConfig } from '@/lib/file-upload-utils';
import Image from 'next/image';

interface FileUploaderProps {
  config: FileUploadConfig;
  onUpload: (files: File[]) => Promise<void>;
  isLoading?: boolean;
  allowedTypesLabel?: string;
}

export function FileUploader({
  config,
  onUpload,
  isLoading = false,
  allowedTypesLabel,
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validation = validateFiles(fileArray, config);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Generate previews
    const newPreviews = fileArray.map((file) => ({
      file,
      url: getFilePreviewUrl(file),
    }));

    setSelectedFiles(fileArray);
    setPreviews(newPreviews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setSelectedFiles(newPreviews.map((p) => p.file));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      await onUpload(selectedFiles)
      // Clear files after successful upload
      previews.forEach((p) => URL.revokeObjectURL(p.url))
      setSelectedFiles([])
      setPreviews([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      // Error handling in parent component
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-8 transition-colors hover:border-muted-foreground/50"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={config.maxFiles > 1}
          accept={config.allowedTypes.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <CloudUpload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              Drag & drop files here
            </p>
            <p className="text-sm text-muted-foreground">
              Or click to browse (max {config.maxFiles} file
              {config.maxFiles > 1 ? "s" : ""}, up to{" "}
              {formatFileSize(config.maxFileSize)} each)
            </p>
          </div>
          {allowedTypesLabel && (
            <p className="mt-2 text-xs text-muted-foreground">
              {allowedTypesLabel}
            </p>
          )}
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Browse files
          </Button>
        </div>
      </div>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Selected files ({previews.length})
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border border-muted-foreground/20 bg-muted"
              >
                {preview.file.type.startsWith("image/") ? (
                  <Image
                    src={preview.url}
                    alt={preview.file.name}
                    className="h-fit w-full object-cover"
                    width={1000}
                    height={1000}
                  />
                ) : (
                  <div className="flex h-32 w-full items-center justify-center bg-muted-foreground/10">
                    <div className="text-center">
                      <p className="truncate px-2 text-xs text-muted-foreground">
                        {preview.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(preview.file.size)}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 rounded bg-destructive/80 p-1 hover:bg-destructive"
                  type="button"
                >
                  <X className="text-destructive-foreground h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {previews.length > 0 && (
        <Button onClick={handleUpload} disabled={isLoading} className="w-full">
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      )}
    </div>
  )
}

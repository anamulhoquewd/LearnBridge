'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileUploadConfig } from '@/lib/file-upload-utils';
import { FileUploader } from './file-uploader';

interface AvatarUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (files: File[]) => void;
  apiEndpoint: string; // e.g., '/api/upload/avatar'
}

const AVATAR_CONFIG: FileUploadConfig = {
  maxFiles: 1,
  maxFileSize: 1024 * 1024, // 1MB
  allowedTypes: ['image/png', 'image/jpeg'],
};

export function AvatarUploadModal({
  open,
  onOpenChange,
  onUploadComplete,
  apiEndpoint,
}: AvatarUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete(files);
      }

      // Close modal on success
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. PNG or JPEG, up to 1MB.
          </DialogDescription>
        </DialogHeader>

        <FileUploader
          config={AVATAR_CONFIG}
          onUpload={handleUpload}
          isLoading={isLoading}
          allowedTypesLabel="Supported formats: PNG, JPEG"
        />
      </DialogContent>
    </Dialog>
  );
}

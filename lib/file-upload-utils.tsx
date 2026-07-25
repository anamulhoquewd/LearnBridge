export interface FileUploadConfig {
  maxFiles: number;
  maxFileSize: number; // in bytes
  allowedTypes: string[]; // e.g., ['image/png', 'image/jpeg']
}

export const validateFiles = (
  files: File[],
  config: FileUploadConfig
): { valid: boolean; error?: string } => {
  if (files.length > config.maxFiles) {
    return { valid: false, error: `Maximum ${config.maxFiles} file(s) allowed` };
  }

  for (const file of files) {
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
      };
    }

    if (file.size > config.maxFileSize) {
      const maxSizeMB = (config.maxFileSize / 1024 / 1024).toFixed(2);
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }
  }

  return { valid: true };
};

export const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

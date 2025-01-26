export interface FileUploadConfig {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  folder?: string;
}

export interface ImageUploaderRef {
  triggerUpload: () => Promise<string | string[]>;
}

export interface ImageUploaderProps {
  value?: string | string[];
  onChange?: (urls: string | string[]) => void;
  config?: FileUploadConfig;
  onUpload?: (urls: string | string[]) => void;
  multiple?: boolean;
}

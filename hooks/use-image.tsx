import { FileUploadConfig } from "@/@types/image";
import { handleError } from "@/lib/zod-error";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

export function useFileUpload(config: FileUploadConfig = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    maxFiles = 5,
    maxSizeInMB = 10,
    allowedTypes = ["image/jpeg", "image/png", "image/gif"],
    folder = "uploads",
  } = config;

  const uploadMutation = api.image.upload.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      if (files.length + selectedFiles.length > maxFiles) {
        toast.error(`Max ${maxFiles} files allowed`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.type}`);
        return false;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size exceeds ${maxSizeInMB}MB`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return uploadMutation.mutateAsync({
          name: file.name,
          type: file.type,
          size: file.size,
          base64,
          folder,
        });
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.url);

      setUploadedUrls(urls);
      setFiles([]);
      setPreviews([]);
      return urls;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    files,
    previews,
    uploadedUrls,
    handleFileSelect,
    uploadFiles,
    removeFile,
    isUploading,
  };
}

export const useImageDelete = () => {
  const utils = api.useUtils();

  const deleteSingleImage = api.image.deleteImage.useMutation({
    onSuccess: () => {
      utils.image.invalidate();
    },
  });

  const deleteMultipleImages = api.image.deleteImages.useMutation({
    onSuccess: () => {
      utils.image.invalidate();
    },
  });

  return {
    deleteSingleImage: (url: string) => deleteSingleImage.mutate({ url }),
    deleteMultipleImages: (urls: string[]) =>
      deleteMultipleImages.mutate({ urls }),
  };
};

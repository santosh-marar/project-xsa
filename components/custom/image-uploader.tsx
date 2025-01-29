// import { FileUploadConfig, useFileUpload } from "@/hooks/use-image";
// import { ImagePlus, X } from "lucide-react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// export function ImageUploader({
//   onUpload,
//   config,
// }: {
//   onUpload?: (urls: string[]) => void;
//   config?: FileUploadConfig;
// }) {
//   const {
//     files,
//     previews,
//     handleFileSelect,
//     uploadFiles,
//     removeFile,
//     isUploading,
//   } = useFileUpload(config);

//   const handleUpload = async () => {
//     const urls = await uploadFiles();
//     if (onUpload && urls) onUpload(urls);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-wrap gap-4">
//         {previews.map((preview, index) => (
//           <div key={preview} className="relative">
//             <img
//               src={preview}
//               alt={`Preview ${index}`}
//               className="w-24 h-24 object-cover rounded-lg"
//             />
//             <button
//               onClick={() => removeFile(index)}
//               className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ))}
//         {previews.length < (config?.maxFiles || 5) && (
//           <label className="cursor-pointer">
//             <div className="w-24 h-24 border-2 border-dashed flex items-center justify-center rounded-lg">
//               <ImagePlus size={32} className="text-gray-400" />
//             </div>
//             <Input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleFileSelect}
//               disabled={isUploading}
//               className="hidden"
//             />
//           </label>
//         )}
//       </div>
//       {files.length > 0 && (
//         <Button onClick={handleUpload} disabled={isUploading} className="mt-4">
//           {isUploading ? "Uploading..." : "Upload"}
//         </Button>
//       )}
//     </div>
//   );
// }
// 
// Here how to use it 
{/* <ImageUploader
        config={{
          maxFiles: 3,
          maxSizeInMB: 5,
          allowedTypes: ["image/jpeg", "image/png"],
          folder: "product-images",
        }}
        onUpload={(urls) => {
          console.log("urls", urls);
        }}
      /> */} 


import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useFileUpload } from "@/hooks/use-image";
import { ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImageUploaderProps, ImageUploaderRef } from "@/@types/image";



export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ value = [], onChange, config = {}, onUpload, multiple = false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
      files,
      previews,
      handleFileSelect,
      uploadFiles,
      removeFile,
      isUploading,
    } = useFileUpload(config);
    
    const triggerUpload = async (): Promise<string | string[]> => {
      if (files.length > 0) {
        const urls = await uploadFiles();
        if (urls && urls.length > 0) {
          const processedUrls = multiple ? urls : urls[0];
          if (onChange) {
            if (multiple) {
              onChange(processedUrls as string[]);
            } else {
              onChange(processedUrls as string);
            }
          }
          if (onUpload) onUpload(processedUrls);
          return processedUrls;
        }
      }
      return multiple ? [] : "";
    };

    useImperativeHandle(ref, () => ({
      triggerUpload,
    }));

    const handleRemove = (indexToRemove: number) => {
      removeFile(indexToRemove);
      if (onChange) {
        const currentValue = Array.isArray(value) ? value : [value];
        const updatedUrls = currentValue.filter(
          (_, index) => index !== indexToRemove
        );
        onChange(multiple ? updatedUrls : updatedUrls[0] || "");
      }
    };

    const currentValues = Array.isArray(value) ? value : value ? [value] : [];
    const currentPreviews = previews;

    // console.log("currentValues", currentValues);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {currentValues.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-32 h-32 object-cover rounded-lg border mp-4"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 m-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {currentPreviews.map((preview, index) => (
            <div key={preview} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 m-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {currentValues.length + currentPreviews.length <
            (config.maxFiles || 5) && (
            <label className="cursor-pointer">
              <div className="w-24 h-24 border-2 border-dashed flex items-center justify-center rounded-lg hover:bg-secondary/20 transition-colors">
                <ImagePlus size={40} className="text-muted-foreground" />
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>
            </label>
          )}
        </div>
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";
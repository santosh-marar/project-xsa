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


import React, { useState } from "react";
import { FileUploadConfig, useFileUpload } from "@/hooks/use-image";
import { ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

export function ImageUploader({
  onUpload,
  config,
}: {
  onUpload?: (urls: string[]) => void;
  config?: FileUploadConfig;
}) {
  const {
    files,
    previews,
    handleFileSelect,
    uploadFiles,
    removeFile,
    isUploading,
  } = useFileUpload(config);

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFormSubmit = async () => {
    if (files.length > 0) {
      const urls = await uploadFiles();
      if (urls) {
        setUploadedUrls(urls);
        if (onUpload) onUpload(urls);
      }
    }
    return uploadedUrls;
  };

  return (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {previews.map((preview, index) => (
              <div key={preview} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {previews.length < (config?.maxFiles || 5) && (
              <label className="cursor-pointer">
                <div className="w-24 h-24 border-2 border-dashed flex items-center justify-center rounded-lg">
                  <ImagePlus size={32} className="text-muted-foreground" />
                </div>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {uploadedUrls.length > 0 && (
            <Input
              type="hidden"
              name="uploadedUrls"
              value={uploadedUrls.join(",")}
            />
          )}
        </div>
      </FormControl>
    </FormItem>
  );
}


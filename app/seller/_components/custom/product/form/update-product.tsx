"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  UpdateProduct,
  updateProductSchema,
} from "@/validation/product/product";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { ImageUploaderRef } from "@/@types/image";
import { ImageUploader } from "@/components/custom/image-uploader";

interface UpdateProductFormProps {
  initialData: UpdateProduct;
}

export function UpdateProductForm({ initialData }: UpdateProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productImage, setProductImage] = useState("");
  const logoRef = useRef<ImageUploaderRef>(null);

  const form = useForm<UpdateProduct>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      ...initialData,
      image: productImage || initialData.image,
    },
  });

  useEffect(() => {
    if (initialData.image) {
      setProductImage(initialData.image);
    }
  }, [initialData.image]);

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating product");
    },
  });

  const onSubmit = async (data: UpdateProduct) => {
    setIsSubmitting(true);

    let uploadedUrl: string | null = null;

    if (logoRef.current) {
      uploadedUrl = (await logoRef.current.triggerUpload()) as string;
    }

    if (!uploadedUrl && !productImage) {
      toast.error("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    await updateProduct.mutateAsync({
      ...data,
      image: uploadedUrl || (productImage as string),
    });
    setIsSubmitting(false);
  };

   return (
     <Card className="w-full lg:w-1/3 rounded-sm">
       <CardHeader>
         <CardTitle>Update Product</CardTitle>
       </CardHeader>
       <CardContent>
         <Form {...form}>
           <form
             onSubmit={form.handleSubmit(onSubmit)}
             className="lg:space-y-4 space-y-2"
           >
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Input {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Textarea {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             <FormField
               control={form.control}
               name="brand"
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Input {...field} placeholder="Brand" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             <FormField
               control={form.control}
               name="material"
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Input {...field} placeholder="Material" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             <div className="pb-4">
               <p>Product image</p>
               <ImageUploader
                 ref={logoRef}
                 value={productImage}
                 onChange={(url) => setProductImage(url as string)}
                 multiple={false}
                 config={{
                   maxFiles: 1,
                   maxSizeInMB: 50,
                   folder: "product-images",
                 }}
               />
             </div>
             <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? "Updating..." : "Update Product"}
             </Button>
           </form>
         </Form>
       </CardContent>
     </Card>
   );
}

"use client";

import { useRef, useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CreateProduct,
  createProductSchema,
} from "@/validation/product/product";
import { api } from "@/trpc/react";
import { ImageUploader } from "@/components/custom/image-uploader";
import { ImageUploaderRef } from "@/@types/image";

interface CreateProductFormProps {
  shops: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function CreateProductForm({
  shops,
  categories,
}: CreateProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState("");

  const logoRef = useRef<ImageUploaderRef>(null);

  const form = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      shopId: "",
      categoryId: "",
      image: "",
      brand: "",
    },
  });

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      // router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(data: CreateProduct) {
    setIsSubmitting(true);
    try {
      // Upload the image and get the URL
      const uploadedUrl = await logoRef.current?.triggerUpload();

      if (!uploadedUrl) {
        toast.error("Please upload an image");
        return;
      }

      // Submit the form data with the image URL
      await createProduct.mutateAsync({
        ...data,
        image: uploadedUrl as string,
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
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
                    <Input {...field} placeholder="Name" />
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
                    <Textarea {...field} placeholder="Description" />
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
            <FormField
              control={form.control}
              name="shopId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shop" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shops?.map((shop) => (
                        <SelectItem key={shop?.id} value={shop?.id}>
                          {shop?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category?.id} value={category?.id}>
                          {category?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="pb-4">
              <p>Product image</p>
              <ImageUploader
                ref={logoRef}
                value={logo}
                multiple={false}
                config={{
                  maxFiles: 1,
                  maxSizeInMB: 50,
                  folder: "product-images",
                }}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

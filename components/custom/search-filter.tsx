"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";


const formSchema = z.object({
  product: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  gender: z.string().optional(),
});

interface FormValues {
  product: string;
  category: string;
  size: string;
  // gender: string;
}

let product = "";
let category = "";
let size = "";
// let gender = "";

function SearchFilter() {
  // const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      category: "",
      size: "",
      // gender: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    product = value.product;
    category = value.category;
    size = value.size;
    // gender = value.gender;
    // dispatch(setProductSearchFilter({ product, category, size }));
  };

  // const debouncedDispatch = debounce((value:FormValues) => {
  //   dispatch(setProductSearchFilter({ product, category, size }));
  // }, 1000);

  return (
    <>
      <Form {...form}>
      <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
      <div className="flex  gap-2">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Search as you own"
                  {...field}
                  className="h-10 w-60 max-w-60 px-2 py-0 font-medium tracking-wide"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          variant="outline"
          type="submit"
          className="h-10 border shadow-none"
        >
          <IconSearch size={24} stroke={2} />
        </Button>
      </div>

      <div className="flex justify-between gap-1">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 w-32 appearance-none text-sm font-normal text-gray-900"
                    )}
                    {...field}
                  >
                    <option value="" className="text-gray-500">
                      Category
                    </option>
                    <option value="jeans">Jeans</option>
                    <option value="t-shirts">Vest</option>
                    <option value="shirts">Shirt</option>
                    <option value="tracks">Tracks</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="jackets">Jacket</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </FormControl>
                <IconChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 w-32 appearance-none text-sm font-normal text-gray-900"
                    )}
                    {...field}
                  >
                    <option value="" className="text-gray-500">
                      Size
                    </option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                    <option value="xxl">XXL</option>
                  </select>
                </FormControl>
                <IconChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </FormItem>
          )}
        />

        {/* <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <div className="relative w-max">
                    <FormControl>
                      <select
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-10  appearance-none text-sm font-normal text-gray-500"
                        )}
                        {...field}
                      >
                        <option value="">Gender</option>
                        <option value="men">men</option>
                        <option value="men&boys">Men & Boys</option>
                        <option value="boys">Boys</option>
                      </select>
                    </FormControl>
                    <IconChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                  </div>
                </FormItem>
              )}
            /> */}
      </div>
      </form>
      </Form>
    </>
  );
}

export default SearchFilter;

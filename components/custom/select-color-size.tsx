"use client";
import React, { useEffect, useState } from "react";
import { IconBounceRight, IconStar } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface SelectColorSizeProps {
  _id: string;
  name: string;
  price: number;
  rating?: number;
  numberOfRating?: number;
  colors: string[];
  sizes: string[];
}

export interface CheckoutData {
  color: string;
  size: string;
  quantity: number;
}

const SelectColorSize: React.FC<SelectColorSizeProps> = ({
  _id,
  name,
  price,
  rating = 0,
  numberOfRating = 0,
  colors,
  sizes,
}) => {
  const router = useRouter();


  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectQuantity, setSelectQuantity] = useState<number | undefined>();
  // const [checkoutData, setCheckoutData] = useState<CheckoutData>();

  // useEffect(() => {
  //   if (checkoutData !== null && checkoutData !== undefined) {
  //     handleCheckout(checkoutData);
  //   }
  // }, [checkoutData]);

  // const handleCheckout = async (data: CheckoutData) => {
  //   setCheckoutData(data);
  // };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (quantity: number) => {
    if (
      quantity !== undefined &&
      quantity !== null &&
      quantity > 0 &&
      quantity <= 5
    ) {
      setSelectQuantity(quantity);
    }
  };

  const handleAddToCart = async () => {
    // const response = await createCartAddOrUpdateItem({
    //   _id,
    //   name,
    //   price,
    //   color: selectedColor,
    //   size: selectedSize,
    //   quantity: selectQuantity,
    // }).unwrap();

    // toast.success(response?.message as string);
  };

  const isDisabled =
    selectedColor === undefined ||
    selectedSize === undefined ||
    selectQuantity === undefined;

  return (
    <div className="container-mobile grid max-w-80 gap-2">
      <div className="flex items-center justify-between">
        <p className="text-normal font-medium"> $ {price}</p>
        <p className="flex items-center gap-0.5 text-gray-500">
          <span className="font-medium">{rating}</span>
          <IconStar stroke={2} size={16} />
          <span className="text-xs">({numberOfRating}+)</span>
        </p>
      </div>

      <div>
        <p className="mb-1 text-sm tracking-wide text-gray-500">Color:</p>
        <ul className="flex gap-2">
          {colors?.map((color, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div
                style={{
                  backgroundColor: color,
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  position: "relative",
                }}
                className="flex items-center justify-center border"
                onClick={() => {
                  handleColorChange(color);
                }}
                title={color}
              >
                {selectedColor === color && (
                  <IconBounceRight
                    size={24}
                    color={
                      color === "white" || color === "yellow"
                        ? "black"
                        : "white"
                    }
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-1 text-sm tracking-wide text-gray-500">Size:</p>
        <ul className="flex gap-2">
          {sizes?.map((size, index) => (
            <li
              key={index}
              className="flex items-center justify-center space-x-2"
            >
              <div
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-base uppercase ${selectedSize === size ? "border border-gray-900" : "border border-gray-200"}`}
                onClick={() => {
                  handleSizeChange(size);
                }}
              >
                <span
                  className={`${selectedSize === size ? "font-semibold" : ""}`}
                >
                  {size}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="z-10">
        <p className="mb-1 text-sm tracking-wide text-gray-500">Quantity:</p>
        <Select
          onValueChange={(quantity: string) => {
            handleQuantityChange(Number(quantity));
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* <button
          className="text-gray-500"
          onClick={() => {
            console.log("Add to Wishlist");
          }}
        >
          <IconShoppingBagPlus size={32} stroke={2} />
        </button> */}

        <Button
          className={`h-12 w-full  rounded-md border px-6 font-medium ${isDisabled ? "border-gray-200 text-gray-500" : "border-gray-700"}`}
          disabled={isDisabled}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>

        {/* <button
          className={`h-12 rounded-md px-6 font-medium text-white ${isDisabled ? "bg-gray-500" : "bg-gray-900"}`}
          disabled={isDisabled}
          onClick={() => {
            // setCheckoutData({
            //   quantity: selectQuantity,
            //   color: selectedColor,
            //   size: selectedSize,
            // });
          }}
        >
          Checkout Now
        </button> */}
      </div>
    </div>
  );
};

export default SelectColorSize;

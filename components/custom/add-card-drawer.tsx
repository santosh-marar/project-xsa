// "use client";
// import * as React from "react";

// import { cn } from "@/lib/utils";
// import { useMediaQuery } from "@custom-react-hooks/all";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import SelectColorSize from "./select-color-size";

// interface DrawerDialogDemoProps {
//   open: boolean;
//   // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setOpen: (open: boolean) => void;
//   // product: ProductDetails["product"];
// }

// export function DrawerDialog({
//   open,
//   setOpen,
//   product,
// }: DrawerDialogDemoProps) {
//   const {
//     _id,
//     name,
//     description,
//     price,
//     brandName,
//     category,
//     subCategory,
//     genders,
//     colors,
//     sizes,
//     imagesUrl,
//     stock,
//     sellerId,
//     createdAt,
//     updatedAt,
//     // __v,
//     wishlistItems,
//     cartItems,
//     reviewStats,
//   } = product;

//   // const [open, setOpen] = React.useState(false);
//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline">{name}</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>{name}</DialogTitle>
//           </DialogHeader>
//           <SelectColorSize
//             _id={_id}
//             name={name}
//             price={price}
//             colors={colors}
//             sizes={sizes}
//             rating={reviewStats?.averageRating}
//             numberOfRating={reviewStats?.reviewCounts}
//           />
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button variant="outline">{name}</Button>
//       </DrawerTrigger>
//       <DrawerContent className="">
//         <DrawerHeader className="text-left">
//           <DrawerTitle>{name}</DrawerTitle>
//         </DrawerHeader>
//         <ImageCarousel imagesUrl={imagesUrl} />
//         <SelectColorSize
//           _id={_id}
//           name={name}
//           price={price}
//           colors={colors}
//           sizes={sizes}
//           rating={reviewStats?.averageRating}
//           numberOfRating={reviewStats?.reviewCounts}
//         />
//         <DrawerFooter className="pt-2">
//           {/* <DrawerClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose> */}
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

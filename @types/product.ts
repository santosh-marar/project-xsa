import {
  PantAttributes,
  ShirtAttributes,
  TShirtAttributes,
  JacketAttributes,
  HoodieAttributes,
  UndergarmentAttributes,
  ShoeAttributes,
  GenericAttributes,
} from "@prisma/client";


export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  shopId: string;
  createdAt: Date;
  updatedAt: Date;
  productCategory: {
    id: string;
    name: string;
    description: string;
  };
  productVariations: ProductVariation[];
  shop: {
    id: string;
    name: string;
    logo: string;
  };
};

export interface ProductVariation {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  image: string[];
  gender: "MALE" | "FEMALE" | "UNISEX";
  ageRange: string;
  tShirtAttributes?: TShirtAttributes;
  pantAttributes?: PantAttributes;
  shoeAttributes?: ShoeAttributes;
  shirtAttributes?: ShirtAttributes;
  jacketAttributes?: JacketAttributes;
  hoodieAttributes?: HoodieAttributes;
  undergarmentAttributes?: UndergarmentAttributes;
  genericAttributes?: GenericAttributes;
}

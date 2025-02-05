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

type ProductVariation = {
  id: string;
  price: number;
  stock: number;
  modelNumber: string | null;
  tShirtAttributes?: TShirtAttributes[];
  pantAttributes?: PantAttributes[];
  shirtAttributes?: ShirtAttributes[];
  jacketAttributes?: JacketAttributes[];
  hoodieAttributes?: HoodieAttributes[];
  undergarmentAttributes?: UndergarmentAttributes[];
  shoeAttributes?: ShoeAttributes[];
  genericAttributes?: GenericAttributes[];
};

export type Shop = {
  id: string;
  logo: string;
  name: string;
  description: string;
  owner: {
    name: string | null;
    email: string;
  };
  shopCategoryId: string;
  createdAt: Date;
};

import { Document } from "mongoose";
import IBrand from "../../admin/types/Brand";
import ICategory from "../../admin/types/Category";
import IScent from "../../admin/types/Scents";
import ISubCategory from "../../admin/types/SubCategory";
import IUser from "../../users/types/users";
import IProductGroup from "./ProductGroup";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  weight: number;
  sticks: number;
  newArrival: boolean;
  bestseller: boolean;
  brand: IBrand;
  scent: IScent;
  category: ICategory;
  subcategory: ISubCategory;
  mainImage: string;
  otherImages: string[];
  currentDiscount: number;
  discountAmount: number;
  createdBy: IUser;
  relatedProducts: IProduct[];
  quantity: number;
  randomIndex: number;
  isArchived: boolean;
}

export = IProduct;

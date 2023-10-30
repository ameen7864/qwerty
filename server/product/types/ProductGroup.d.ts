import { Document } from "mongoose";
import IUser from "../../users/types/users";
import IProduct from "./Product";

interface IProductGroup extends Document {
  name: string;
  products: IProduct[];
  createdBy: IUser;
  isArchived: boolean;
}

export = IProductGroup;

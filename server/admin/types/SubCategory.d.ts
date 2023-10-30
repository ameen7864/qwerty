import { Document } from "mongoose";
import IUser from "../../users/types/users";
import ICategory from "./Category";

interface ISubCategory extends Document {
  name: string;
  category: ICategory;
  image: string;
  createdBy: IUser;
  isArchived: boolean;
}

export = ISubCategory;

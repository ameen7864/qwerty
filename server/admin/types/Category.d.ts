import { Document } from "mongoose";
import IUser from "../../users/types/users";

interface ICategory extends Document {
  name: string;
  image: string;
  createdBy: IUser;
  isArchived: boolean;
}

export = ICategory;

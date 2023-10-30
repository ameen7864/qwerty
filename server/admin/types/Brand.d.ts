import { Document } from "mongoose";
import IUser from "../../users/types/users";

interface IBrand extends Document {
  name: string;
  logo: string;
  createdBy: IUser;
  isArchived: boolean;
}

export = IBrand;

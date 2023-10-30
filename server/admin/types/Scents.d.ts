import { Document } from "mongoose";
import IUser from "../../users/types/users";

interface IScent extends Document {
  name: string;
  color: string;
  createdBy: IUser;
  isArchived: boolean;
}

export = IScent;

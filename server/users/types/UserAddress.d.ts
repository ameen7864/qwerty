import { Document } from "mongoose";
import IUser from "./users";

interface IUserAddress extends Document {
  user: IUser;
  name: string;
  line1: string;
  line2: string;
  area: string;
  city: string;
  state: string;
  pincode: number;
  type: "billing" | "order";
  isArchived: boolean;
}

export = IUserAddress;

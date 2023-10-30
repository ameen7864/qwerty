import { Document } from "mongoose";
import IUser from "./users";

interface IContactUs extends Document {
  name: string;
  email: string;
  mobile: string;
  enquireFor: string;
  description: string;
  user: IUser;
}

export = IContactUs;

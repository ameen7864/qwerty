import { Document } from "mongoose";
import IUser from "./users";

interface IOtp extends Document {
  email: string;
  mobile: string;
  otp: number;
  validTill: Date;
}

export = IOtp;

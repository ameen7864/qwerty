import { Document } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: number;
  countryCode: number;
  dp: string;
  signupType: "email" | "mobile" | "google";
  emailVerified: boolean;
  mobileVerified: boolean;
  verifiedBy: "google" | "email" | "mobile" | "admin";
  password: string;
  role: "admin" | "user" | "staff";
  gender: "male" | "female" | "other";
  addedBy: IUser;
  verifyPassword: (this: IUser, password: string) => Promise<boolean>;
}

export = IUser;

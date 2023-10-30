import { compare } from "bcrypt";
import { model, Schema } from "mongoose";
import IUser from "../types/users";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, index: true },
    mobile: { type: Number, index: true },
    username: { type: String, index: true },
    dp: String,
    countryCode: Number,
    signupType: { type: String, enum: ["mobile", "email", "google"] },
    password: String,
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    verifiedBy: { type: String, enum: ["admin", "google", "otp"] },
    role: { type: String, enum: ["user", "staff", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female", "other"] },
    addedBy: { type: ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

schema.method({
  async verifyPassword(this: IUser, password: string) {
    return await compare(password, this.password);
  },
});

const UserModel = model<IUser>("Users", schema);
export default UserModel;

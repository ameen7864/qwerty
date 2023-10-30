import { Document, model, Schema } from "mongoose";
import IUser from "../types/users";

const {
  Types: { ObjectId },
} = Schema;

interface IUserToken extends Document {
  user: IUser;
  token: string;
  expiresAt: Date;
  active: boolean;
}

const schema = new Schema(
  {
    user: { type: ObjectId, ref: "Users", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const UserTokenModel = model<IUserToken>("UserTokens", schema);
export default UserTokenModel;

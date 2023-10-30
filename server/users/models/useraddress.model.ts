import { model } from "mongoose";
import { Schema } from "mongoose";
import IUserAddress from "../types/UserAddress";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    user: { type: ObjectId, ref: "Users", required: true },
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    isArchived: { type: Boolean, default: false },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const UserAddressModel = model<IUserAddress>("UserAddresses", schema);
export = UserAddressModel;

import { model } from "mongoose";
import { Schema } from "mongoose";
import ICart from "./Cart";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    user: { type: ObjectId, ref: "Users" },
    device: { type: ObjectId, ref: "Devices" },
    product: { type: ObjectId, ref: "Products" },
    quantity: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CartModel = model<ICart>("Carts", schema);

export = CartModel;

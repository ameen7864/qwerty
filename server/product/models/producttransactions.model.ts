import { Schema, model } from "mongoose";
import { IProductTransactions } from "../types/ProductTransaction";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    order: { type: ObjectId, ref: "Orders" },
    user: { type: ObjectId, ref: "Users" },
    quantity: { type: Number, required: true },
    closing: { type: Number, required: true },
    product: { type: ObjectId, ref: "Products", required: true },
    entryType: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductTransactionModel = model<IProductTransactions>(
  "ProductTransactions",
  schema
);

export = ProductTransactionModel;

import { model, Schema } from "mongoose";
import IPrices from "../types/Prices";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    price: { type: Number, required: true },
    changedOn: { type: Date, required: true },
    changedBy: { type: ObjectId, ref: "Users", required: true },
    product: { type: ObjectId, ref: "Users", required: true },
  },
  { timestamps: true }
);

const PricesModel = model<IPrices>("Prices", schema);

export = PricesModel;

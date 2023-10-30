import { model, Schema } from "mongoose";
import IBrand from "../types/Brand";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    logo: String,
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BrandModel = model<IBrand>("Brands", schema);

export = BrandModel;

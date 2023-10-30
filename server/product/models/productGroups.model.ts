import { model, Schema } from "mongoose";
import IProductGroup from "../types/ProductGroup";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    products: [{ type: ObjectId, ref: "Products" }],
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const ProductGroupModel = model<IProductGroup>("ProductGroups", schema);

export = ProductGroupModel;

import { model, Schema } from "mongoose";
import ICategory from "../types/Category";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    image: String,
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CategoryModel = model<ICategory>("Categories", schema);

export = CategoryModel;

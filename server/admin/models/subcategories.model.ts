import { model, Schema } from "mongoose";
import ISubCategory from "../types/SubCategory";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    image: String,
    category: { type: ObjectId, ref: "Categories", required: true },
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SubCategoryModel = model<ISubCategory>("SubCategories", schema);

export = SubCategoryModel;

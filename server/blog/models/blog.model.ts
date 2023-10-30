import { model, Schema } from "mongoose";
import IBlog from "../types/Blog";

const schema = new Schema(
  {
    title: { type: String },
    subtitle: String,
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    featuredImages: [String],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
  },
  {
    timestamps: true,
  }
);

const BlogModel = model<IBlog>("Blogs", schema);

export = BlogModel;

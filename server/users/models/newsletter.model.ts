import { Schema, model } from "mongoose";
import INewsletter from "../types/Newsletter";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    email: { type: String, required: true },
    device: { type: ObjectId, ref: "Devices" },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NewsletterModel = model<INewsletter>("Newsletters", schema);

export = NewsletterModel;

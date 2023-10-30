import { model, Schema } from "mongoose";
import IScent from "../types/Scents";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    color: String,
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ScentModel = model<IScent>("Scents", schema);

export = ScentModel;

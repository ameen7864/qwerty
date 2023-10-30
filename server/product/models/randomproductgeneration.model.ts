import { Schema, model } from "mongoose";
import IRandomProductGeneration from "../types/RandomProductGenration";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    user: { type: ObjectId, ref: "Users", required: true },
    createdOn: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

const RandomProductGenerationModel = model<IRandomProductGeneration>(
  "RandomProductGeneration",
  schema
);

export = RandomProductGenerationModel;

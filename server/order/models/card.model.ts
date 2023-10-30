import { Schema, model } from "mongoose";
import ICard from "../types/Card";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    number: { type: String, required: true },
    cvv: { type: String, required: true },
    network: { type: String, required: true },
    type: { type: String, required: true },
    user: { type: ObjectId, ref: "Users", required: true },
  },
  {
    timestamps: true,
  }
);

const CardModel = model<ICard>("Cards", schema);

export = CardModel;

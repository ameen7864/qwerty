import { Schema, model } from "mongoose";
import IContactUs from "../types/ContactUs";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  enquireFor: { type: String, required: true },
  description: String,
  user: ObjectId,
});

const ContactUsModel = model<IContactUs>("ContactUs", schema);

export = ContactUsModel;

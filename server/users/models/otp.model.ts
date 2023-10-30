import { model, Schema } from "mongoose";
import IOtp from "../types/otp";

const schema = new Schema(
  {
    email: String,
    mobile: String,
    otp: { type: Number, required: true },
    validTill: { type: Date, required: true },
  },
  { timestamps: true }
);

const OtpModel = model<IOtp>("OTPs", schema);

export default OtpModel;

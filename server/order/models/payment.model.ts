import { Schema, model } from "mongoose";
import IPayment from "../types/Payments";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    orderId: { type: String, required: true },
    paymentId: String, // razorpay / instamojo
    signature: String, // razorpay
    paymentRequestId: String, // instamojo
    instamojoPaymentObject: { type: {} },
    gateway: { type: String, default: "instamojo" },
    order: { type: ObjectId, ref: "Orders", required: true },
    user: { type: ObjectId, ref: "Users", required: true },
    method: String,
    status: { type: String, default: "created" },
  },
  { timestamps: true }
);

const PaymentModel = model<IPayment>("Payments", schema);
export = PaymentModel;

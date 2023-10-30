import { Schema, model } from "mongoose";
import IOrder from "../types/Order";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    orderNo: { type: String, required: true, index: true },
    user: { type: ObjectId, ref: "Users", required: true },
    device: { type: ObjectId, ref: "Devices", required: true },
    items: {
      type: [
        {
          product: { type: ObjectId, ref: "Products", required: true },
          quantity: { type: Number, required: true },
          effectivePrice: { type: Number, required: true },
          actualPrice: { type: Number, required: true },
          discount: Number,
          discountValue: { type: Number, default: 0 },
        },
      ],
      required: true,
    },
    date: { type: Date, default: new Date() },
    paymentStatus: { type: String, default: "initiated" },
    orderStatus: { type: String, default: "initiated" },
    isPaid: { type: Boolean, default: false },
    isFailed: { type: Boolean, default: false },
    payment: { type: ObjectId, ref: "Payments" },
    address: { type: ObjectId, ref: "UserAddresses" },
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderModel = model<IOrder>("Orders", schema);

export = OrderModel;

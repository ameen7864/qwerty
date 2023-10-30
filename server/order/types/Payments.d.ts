import { Document } from "mongoose";
import IOrder from "./Order";
import IUser from "../../users/types/users";
import ICard from "./Card";

interface IPayment extends Document {
  orderId: string;
  paymentId: string;
  signature: string;
  paymentRequestId: string;
  instamojoPaymentObject: any;
  gateway: "instamojo" | "razorpay";
  order: IOrder;
  user: IUser;
  method: "upi" | "cod" | "card" | "netbanking" | "wallet";
  status: string;
}

export = IPayment;

import { Document } from "mongoose";
import IUser from "../../users/types/users";
import IDevice from "../../users/types/devices";
import IProduct from "../../product/types/Product";
import IPayment from "./Payments";
import ICard from "./Card";
import IUserAddress from "../../users/types/UserAddress";

interface Items {
  product: IProduct;
  quantity: number;
  effectivePrice: number;
  actualPrice: number;
  discount: number;
  discountValue: number;
}

interface IOrder extends Document {
  orderNo: string;
  user: IUser;
  device: IDevice;
  items: Items[];
  date: Date;
  paymentStatus: string;
  isPaid: boolean;
  isFailed: boolean;
  payment: IPayment;
  orderStatus: string;
  address: IUserAddress;
  deliveryCharge: number;
  total: number;
}

export = IOrder;

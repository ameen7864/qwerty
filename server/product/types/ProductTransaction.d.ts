import { Document } from "mongoose";
import IProduct from "./Product";
import IOrder from "../../order/types/Order";
import IUser from "../../users/types/users";

interface IProductTransactions extends Document {
  product: IProduct;
  entryType: "credit" | "debit";
  quantity: number;
  order: IOrder;
  user: IUser;
  closing: number;
}

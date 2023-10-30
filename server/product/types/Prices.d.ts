import { Document } from "mongoose";
import IUser from "../../users/types/users";
import IProduct from "./Product";

interface IPrices extends Document {
  price: number;
  changedOn: Date;
  changedBy: IUser;
  product: IProduct;
}

export = IPrices;

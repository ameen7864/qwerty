import { Document } from "mongoose";
import IProduct from "../product/types/Product";
import IUser from "../users/types/users";
import { IDevice } from "../users/types/devices";

interface IWishlist extends Document {
  product: IProduct;
  user: IUser;
  device: IDevice;
  isArchived: boolean;
}

export = IWishlist;

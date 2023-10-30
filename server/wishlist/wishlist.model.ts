import { Schema, model } from "mongoose";
import IWishlist from "./Wishlist";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema({
  product: { type: ObjectId, ref: "Products", required: true },
  user: { type: ObjectId, ref: "Users" },
  device: { type: ObjectId, ref: "Devices" },
  isArchived: { type: Boolean, default: false },
});

const WishlistModel = model<IWishlist>("Wishlists", schema);

export = WishlistModel;

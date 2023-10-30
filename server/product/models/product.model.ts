import { model, Schema } from "mongoose";
import IProduct from "../types/Product";
import ProductTransactionModel from "./producttransactions.model";
import logger from "../../../config/winston";
import PricesModel from "./prices.model";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    weight: Number,
    sticks: Number,
    newArrival: { type: Boolean, default: false, required: true },
    bestseller: { type: Boolean, default: false, required: true },
    brand: { type: ObjectId, required: true, ref: "Brands" },
    scent: { type: ObjectId, required: true, ref: "Scents" },
    category: { type: ObjectId, required: true, ref: "Categories" },
    subcategory: { type: ObjectId, required: true, ref: "SubCategories" },
    mainImage: { type: String, required: true },
    otherImages: [{ type: String, required: true }],
    currentDiscount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    randomIndex: { type: Number, required: true },
    createdBy: { type: ObjectId, ref: "Users", required: true },
    relatedProducts: [{ type: ObjectId, ref: "Products" }],
    isArchived: { type: Boolean, default: false, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

schema.post("save", function (this) {
  if (this.quantity && this.quantity > 0) {
    new ProductTransactionModel({
      user: this.createdBy,
      quantity: this.quantity,
      entryType: "credit",
      closing: this.quantity,
      product: this._id,
    }).save((err) => {
      if (err) {
        logger.error(
          `Error while saving transaction on product: ${this._id} for quantity: ${this.quantity}`
        );
      }
    });
  }
  new PricesModel({
    product: this._id,
    changedOn: Date.now(),
    changedBy: this.createdBy,
    price: this.price,
  }).save((err) => {
    if (err) {
      logger.error(
        `Error while saving price on product: ${this._id} for price: ${this.price}`
      );
    }
  });
});

const ProductModel = model<IProduct>("Products", schema);

export = ProductModel;

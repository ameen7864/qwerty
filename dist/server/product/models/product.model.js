"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = require("mongoose");
const producttransactions_model_1 = __importDefault(require("./producttransactions.model"));
const winston_1 = __importDefault(require("../../../config/winston"));
const prices_model_1 = __importDefault(require("./prices.model"));
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
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
}, { timestamps: true });
schema.post("save", function () {
    if (this.quantity && this.quantity > 0) {
        new producttransactions_model_1.default({
            user: this.createdBy,
            quantity: this.quantity,
            entryType: "credit",
            closing: this.quantity,
            product: this._id,
        }).save((err) => {
            if (err) {
                winston_1.default.error(`Error while saving transaction on product: ${this._id} for quantity: ${this.quantity}`);
            }
        });
    }
    new prices_model_1.default({
        product: this._id,
        changedOn: Date.now(),
        changedBy: this.createdBy,
        price: this.price,
    }).save((err) => {
        if (err) {
            winston_1.default.error(`Error while saving price on product: ${this._id} for price: ${this.price}`);
        }
    });
});
const ProductModel = (0, mongoose_1.model)("Products", schema);
module.exports = ProductModel;

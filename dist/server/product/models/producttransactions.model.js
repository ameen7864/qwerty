"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    order: { type: ObjectId, ref: "Orders" },
    user: { type: ObjectId, ref: "Users" },
    quantity: { type: Number, required: true },
    closing: { type: Number, required: true },
    product: { type: ObjectId, ref: "Products", required: true },
    entryType: { type: String, required: true },
}, { timestamps: true });
const ProductTransactionModel = (0, mongoose_1.model)("ProductTransactions", schema);
module.exports = ProductTransactionModel;

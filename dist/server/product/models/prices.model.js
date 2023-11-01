"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    price: { type: Number, required: true },
    changedOn: { type: Date, required: true },
    changedBy: { type: ObjectId, ref: "Users", required: true },
    product: { type: ObjectId, ref: "Users", required: true },
}, { timestamps: true });
const PricesModel = (0, mongoose_1.model)("Prices", schema);
module.exports = PricesModel;

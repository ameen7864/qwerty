"use strict";
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_2.Schema;
const schema = new mongoose_2.Schema({
    user: { type: ObjectId, ref: "Users" },
    device: { type: ObjectId, ref: "Devices" },
    product: { type: ObjectId, ref: "Products" },
    quantity: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });
const CartModel = (0, mongoose_1.model)("Carts", schema);
module.exports = CartModel;

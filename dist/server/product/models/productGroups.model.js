"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    products: [{ type: ObjectId, ref: "Products" }],
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false, required: true },
}, { timestamps: true });
const ProductGroupModel = (0, mongoose_1.model)("ProductGroups", schema);
module.exports = ProductGroupModel;

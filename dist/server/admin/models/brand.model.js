"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    logo: String,
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });
const BrandModel = (0, mongoose_1.model)("Brands", schema);
module.exports = BrandModel;

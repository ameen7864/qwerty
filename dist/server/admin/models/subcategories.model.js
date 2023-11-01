"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: String,
    category: { type: ObjectId, ref: "Categories", required: true },
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });
const SubCategoryModel = (0, mongoose_1.model)("SubCategories", schema);
module.exports = SubCategoryModel;

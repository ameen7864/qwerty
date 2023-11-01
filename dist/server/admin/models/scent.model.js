"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    color: String,
    createdBy: { type: ObjectId, ref: "Users", required: true },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });
const ScentModel = (0, mongoose_1.model)("Scents", schema);
module.exports = ScentModel;

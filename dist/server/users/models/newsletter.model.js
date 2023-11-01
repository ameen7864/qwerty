"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    email: { type: String, required: true },
    device: { type: ObjectId, ref: "Devices" },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });
const NewsletterModel = (0, mongoose_1.model)("Newsletters", schema);
module.exports = NewsletterModel;

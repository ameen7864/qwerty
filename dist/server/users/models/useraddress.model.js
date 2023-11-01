"use strict";
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_2.Schema;
const schema = new mongoose_2.Schema({
    user: { type: ObjectId, ref: "Users", required: true },
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    isArchived: { type: Boolean, default: false },
    type: { type: String, required: true },
}, { timestamps: true });
const UserAddressModel = (0, mongoose_1.model)("UserAddresses", schema);
module.exports = UserAddressModel;

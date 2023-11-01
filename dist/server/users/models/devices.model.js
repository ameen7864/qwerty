"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    deviceId: { type: String, required: true, unique: true },
    user: { type: ObjectId, ref: "Users" },
    browser: String,
    platform: String,
    ip: String,
    os: String,
    version: String,
}, { timestamps: true });
const DeviceModel = (0, mongoose_1.model)("Devices", schema);
module.exports = DeviceModel;

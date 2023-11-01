"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: "Users", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
}, { timestamps: true });
const UserTokenModel = (0, mongoose_1.model)("UserTokens", schema);
exports.default = UserTokenModel;

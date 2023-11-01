"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    orderId: { type: String, required: true },
    paymentId: String,
    signature: String,
    paymentRequestId: String,
    instamojoPaymentObject: { type: {} },
    gateway: { type: String, default: "instamojo" },
    order: { type: ObjectId, ref: "Orders", required: true },
    user: { type: ObjectId, ref: "Users", required: true },
    method: String,
    status: { type: String, default: "created" },
}, { timestamps: true });
const PaymentModel = (0, mongoose_1.model)("Payments", schema);
module.exports = PaymentModel;

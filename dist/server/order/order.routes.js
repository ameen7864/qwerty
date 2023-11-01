"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const orderRoutes = (0, express_1.Router)();
// @ts-ignore
orderRoutes.route("/my").get(auth_1.default.required, order_controller_1.getMyOrders);
// @ts-ignore
orderRoutes.route("/create").post(auth_1.default.required, order_controller_1.create);
// @ts-ignore
orderRoutes.route("/get-summery").get(auth_1.default.required, order_controller_1.getOrderSummery);
// @ts-ignore
orderRoutes.route("/razorpay/create").post(auth_1.default.required, order_controller_1.createRazorpayOrder);
// @ts-ignore
orderRoutes.route("/razorpay/verify").post(auth_1.default.required, order_controller_1.verifyRazorpayOrder);
// @ts-ignore
orderRoutes.route("/status").post(auth_1.default.required, order_controller_1.changeOrderStatus);
// @ts-ignore
orderRoutes.route("/pay").post(auth_1.default.required, order_controller_1.pay);
// @ts-ignore
orderRoutes.route("/complete").get(auth_1.default.required, order_controller_1.complete);
// @ts-ignore
orderRoutes.route("/").get(auth_1.default.required, auth_1.default.isAtLeastStaff, order_controller_1.getOrdersAdmin);
orderRoutes
    .route("/order-summery-admin")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, order_controller_1.getOrderSummeryAdmin);
module.exports = orderRoutes;

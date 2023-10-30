import { Router } from "express";
import auth from "../middlewares/auth";
import {
  changeOrderStatus,
  complete,
  create,
  createRazorpayOrder,
  getMyOrders,
  getOrderSummery,
  getOrderSummeryAdmin,
  getOrdersAdmin,
  pay,
  verifyRazorpayOrder,
} from "./order.controller";

const orderRoutes = Router();

// @ts-ignore
orderRoutes.route("/my").get(auth.required, getMyOrders);

// @ts-ignore
orderRoutes.route("/create").post(auth.required, create);

// @ts-ignore
orderRoutes.route("/get-summery").get(auth.required, getOrderSummery);

// @ts-ignore
orderRoutes.route("/razorpay/create").post(auth.required, createRazorpayOrder);

// @ts-ignore
orderRoutes.route("/razorpay/verify").post(auth.required, verifyRazorpayOrder);

// @ts-ignore
orderRoutes.route("/status").post(auth.required, changeOrderStatus);

// @ts-ignore
orderRoutes.route("/pay").post(auth.required, pay);

// @ts-ignore
orderRoutes.route("/complete").get(auth.required, complete);

// @ts-ignore
orderRoutes.route("/").get(auth.required, auth.isAtLeastStaff, getOrdersAdmin);

orderRoutes
  .route("/order-summery-admin")
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, getOrderSummeryAdmin);

export = orderRoutes;

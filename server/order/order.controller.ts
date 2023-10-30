import {
  filter,
  forEach,
  get,
  isArray,
  isNaN,
  map,
  toNumber,
  toString,
} from "lodash";
import OrderModel from "./models/order.model";
import { generateOrderId } from "./utils";
import Razorpay from "razorpay";
import config, {
  instamojoApiKey,
  instamojoAuthToken,
  orderWebRoute,
  razorpayKey,
  razorpaySecret,
  shopWebRoute,
} from "../../config/config";
import { createHmac } from "crypto";
import PaymentModel from "./models/payment.model";
// @ts-ignore
import Insta from "instamojo-nodejs";
import logger from "../../config/winston";
import { FilterQuery, isValidObjectId } from "mongoose";
import IOrder from "./types/Order";
import { clearKeysAndAppendObject } from "../utils/others";
import ProductModel from "../product/models/product.model";
import IProduct from "../product/types/Product";

const findQuantityInItems = (items: any[], product: string) => {
  const products = filter(items, (item) => item.product === product);
  return get(products, "[0].quantity", 0);
};

export const create = async (req: any, res: any) => {
  const { id } = req.payload;
  const { items, device } = req.body;

  if (!items || !isArray(items) || items.length === 0)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  const orderNo = await generateOrderId();

  const products = map(items, (item) => item.product);

  ProductModel.find({ _id: { $in: products } })
    .then((products) => {
      let total = 0;
      let deliveryCharges = 0;
      const pros = map(products, (product) => {
        const quantity = findQuantityInItems(items, toString(product._id));
        if (quantity) {
          const effectivePrice = product.price - product.discountAmount;
          total += effectivePrice * quantity;

          return {
            product: product._id,
            quantity,
            effectivePrice,
            actualPrice: product.price,
            discount: product.currentDiscount,
            discountValue: product.discountAmount,
          };
        } else {
          return undefined;
        }
      });
      if (total < 100000) {
        total += 3000;
        deliveryCharges = 3000;
      }
      if (items.indexOf(undefined) === -1) {
        new OrderModel({
          items: pros,
          user: id,
          orderNo,
          orderStatus: "created",
          device,
          deliveryCharge: deliveryCharges,
          total,
        }).save((err, saved) => {
          if (err)
            res.send({ success: false, msg: "Error while creating order!" });
          else res.send({ success: true, order: saved });
        });
      } else {
        res.send({ success: false, msg: "Error while creating order!" });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while getting product details!" });
    });
};

export const getOrderSummery = (req: any, res: any) => {
  const { id } = req.query;

  OrderModel.findOne({ orderNo: id })
    .populate({
      path: "items.product",
      populate: [
        { path: "brand", select: "name" },
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
        { path: "scent", select: "name" },
      ],
    })
    .then((order) => {
      if (!order) res.send({ success: false, msg: "Order not found!" });
      else res.send({ success: true, order });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while processing request!" })
    );
};

export const createRazorpayOrder = (
  req: any,
  res: any
) => {
  try {
    const { id } = req.payload;
    const { orderNo, currency = "INR" } = req.body;
    const razorpay = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret,
    });

    OrderModel.findOne({ orderNo })
      .populate("items.product")
      .then((dbOrder) => {
        if (!dbOrder) res.send({ success: false, msg: "Order not found!" });
        else {
          let total = 0;
          forEach(get(dbOrder, "items", []), (item) => {
            total += item.effectivePrice * item.quantity;
          });
          razorpay.orders.create(
            { amount: total, currency, receipt: orderNo },
            async (err, order) => {
              if (err)
                res.send({
                  success: false,
                  msg: "Error while creating payment!",
                });
              else {
                const payment = new PaymentModel({
                  user: id,
                  orderId: order.id,
                  order: dbOrder._id,
                });
                payment.save((err, saved) => {
                  if (err) {
                    res.send({ success: false, msg: "Failed to create order" });
                  } else
                    res.send({
                      success: true,
                      order,
                      key: razorpayKey,
                      payment: saved._id,
                    });
                });
              }
            }
          );
        }
      })
      .catch((err) =>
        res.send({ success: false, msg: "Error while fetching order!" })
      );
  } catch (err) {
    res.send({ success: false, msg: "Error while processing request!" });
  }
};

export const verifyRazorpayOrder = async (
  req: any,
  res: any
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const generated = createHmac("sha256", razorpaySecret)
      .update(sign)
      .digest("hex");

    if (generated === razorpay_signature) {
      res.send({ success: true, msg: "Razorpay Payment verified!" });
    } else res.send({ success: false, msg: "Razorpay Payment not verified!" });
  } catch (err) {
    res.send({ success: false, msg: "Error while verifying!" });
  }
};

export const getOrderSummeryAdmin = (
  req: any,
  res: any
) => {
  const { order } = req.query;

  OrderModel.findById(order)
    .populate([
      { path: "items.product", populate: ["brand", "category", "subcategory"] },
      { path: "user", select: "firstName lastName email mobile" },
      { path: "address" },
      { path: "payment" },
    ])
    .then((order) => {
      if (!order) res.send({ success: false, msg: "Order not found!" });
      else res.send({ success: true, order });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while fetching order!", err })
    );
};

export const changeOrderStatus = async (
  req: any,
  res: any
) => {
  const {
    orderNo,
    orderStatus,
    isPaid,
    isFailed,
    paymentStatus,
    payment,
    razorpay_payment_id,
    razorpay_signature,
    address,
  } = req.body;

  await PaymentModel.updateOne(
    { _id: payment },
    {
      $set: {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    }
  );

  OrderModel.updateOne(
    { orderNo },
    {
      $set: {
        orderStatus,
        isPaid,
        isFailed,
        paymentStatus,
        payment,
        address,
        date: new Date(),
      },
    }
  )
    .then(() => {
      res.send({ success: true, msg: "Order Placed!" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false, msg: "Error while Placing Order!" });
    });
};

export const getMyOrders = (req: any, res: any) => {
  try {
    const { skip, limit, keywords } = req.query;

    let qSkip = 0;
    let qLimit = 20;

    if (!isNaN(toNumber(skip))) qSkip = toNumber(skip);
    if (!isNaN(toNumber(limit))) qLimit = toNumber(limit);

    const { id } = req.payload;
    const query: any = {
      user: id,
      $or: [],
    };
    const regex = { $regex: keywords, $options: "i" };

    if (keywords) {
      query.$or.push({ orderNo: regex });
    } else {
      query.$or.push({ orderStatus: { $in: ["success", "failed"] } });
      query.$or.push({ paymentStatus: { $in: ["success", "failed"] } });
    }

    const match = keywords ? { name: regex } : undefined;

    const populate = {
      path: "items.product",
      populate: [
        { path: "brand", select: "name" },
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
        { path: "scent", select: "name" },
      ],
      match,
    };

    OrderModel.find(query)
      .sort({ date: -1 })
      .skip(qSkip)
      .limit(qLimit)
      .populate(populate)
      .then((orders) => {
        OrderModel.find(query)
          .countDocuments()
          .then((total) => {
            res.send({ success: true, orders, total });
          })
          .catch((err) => {
            res.send({ success: false, msg: "Error while fetching orders!" });
          });
      })
      .catch((err) => {
        res.send({ success: false, msg: "Error while fetching orders!" });
      });
  } catch (err) {
    res.send({ success: false, msg: "Error while fetching orders!" });
  }
};

const getRedirectUrl = () => {
  return `${
    config.env === "development"
      ? `http://localhost:${config.port}`
      : "https://napi.manubrothers.com"
  }/orders/complete`;
};

export const pay = (req: any, res: any) => {
  const { order, address } = req.body;
  const { id } = req.payload;

  if (!order)
    return res.send({ success: false, msg: "Order number not found!" });

  OrderModel.findOne({ orderNo: order })
    .populate({ path: "user", select: "email firstName lastName mobile" })
    .then(async (order) => {
      if (order) {
        await OrderModel.updateOne({ _id: order._id }, { $set: { address } });

        Insta.setKeys(instamojoApiKey, instamojoAuthToken);
        Insta.isSandboxMode(config.env === "development");
        const redirectUrl = getRedirectUrl();
        const total = order.total;
        const data = Insta.PaymentData();
        data.purpose = `Order No ${order.orderNo} Payment`;
        data.amount = total / 100;
        data.buyer_name = `${get(order, "user.firstName")} ${get(
          order,
          "user.lastName"
        )}`;
        data.redirect_url = redirectUrl;
        if (get(order, "user.mobile")) {
          data.mobile = get(order, "user.mobile");
        }
        if (get(order, "user.email")) {
          data.email = get(order, "user.email");
        }

        data.allow_repeated_payments = "False";
        data.currency = "INR";

        logger.info({
          message: "Payment Capture on instamojo started",
          user: id,
          order: order._id,
        });

        // @ts-ignore
        Insta.createPayment(data, async (err, response) => {
          if (err) {
            logger.error({
              message: "Payment not for Created on instamojo",
              user: id,
              order: order._id,
              error: err,
            });
            res.send({ success: false, msg: "Error while making payment!" });
          } else {
            const jsonResponse = JSON.parse(response);
            logger.info({
              message: "Payment Created on instamojo",
              user: id,
              order: order._id,
              paymentObject: get(jsonResponse, "payment_request"),
            });
            const payment = new PaymentModel({
              instamojoPaymentObject: get(jsonResponse, "payment_request"),
              paymentRequestId: get(jsonResponse, "payment_request.id"),
              order: order,
              orderId: order.orderNo,
              user: id,
              gateway: "instamojo",
              status: "Created",
            });
            payment
              .save()
              .then((pay) => {
                console.log({ pay, jsonResponse });
                if (jsonResponse.success) {
                  logger.info({
                    message: "Instamojo Payment Saved in local database",
                    user: id,
                    order: order._id,
                    paymentId: pay._id,
                    paymentObject: get(jsonResponse, "payment_request"),
                  });
                  res.send({
                    success: true,
                    url: jsonResponse.payment_request.longurl,
                  });
                } else {
                  logger.error({
                    message: `Instamojo Error occured, message: ${jsonResponse.message}`,
                    user: id,
                    order: order._id,
                    paymentObject: get(jsonResponse, "payment_request"),
                  });
                  res.send({
                    success: false,
                    msg: "Error while creating payment!",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                logger.info({
                  message: "Payment not Created on instamojo",
                  user: id,
                  order: order._id,
                  error: err,
                });
              });
          }
        });
      } else return res.send({ success: false, msg: "Order not found!" });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while getting order details!" });
    });
};

export const complete = (req: any, res: any) => {
  const { payment_id, payment_status, payment_request_id } = req.query;
  const { id } = req.payload;

  PaymentModel.findOne({ paymentRequestId: payment_request_id }).then(
    async (payment) => {
      if (!payment) {
        logger.error({
          message: "Payment Callback called but failed to find in database",
          user: id,
          req: { query: { payment_id, payment_status, payment_request_id } },
        });
        res.redirect(shopWebRoute);
      } else {
        payment.status = toString(payment_status);
        payment.paymentId = toString(payment_id);
        logger.info({
          message: "Payment Callback called and status update started!",
          user: id,
          req: { query: { payment_id, payment_status, payment_request_id } },
        });
        await payment.save();
        if (payment_status === "Credit") {
          await OrderModel.updateOne(
            { _id: payment.order },
            {
              $set: {
                isPaid: true,
                isFailed: false,
                paymentStatus: "success",
                orderStatus: "success",
                payment: payment._id,
              },
            }
          ).catch(() => {
            logger.error({
              message:
                "Payment Callback called and status not updated in order database!",
              user: id,
              orderId: payment.orderId,
              req: {
                query: { payment_id, payment_status, payment_request_id },
              },
            });
          });
        } else
          await OrderModel.updateOne(
            { _id: payment.order },
            {
              $set: {
                isPaid: false,
                isFailed: true,
                paymentStatus: "failed",
                orderStatus: "failed",
              },
            }
          ).catch(() => {
            logger.error({
              message:
                "Payment Callback called and status not updated in order database!",
              user: id,
              orderId: payment.orderId,
              req: {
                query: { payment_id, payment_status, payment_request_id },
              },
            });
          });
        payment
          .save()
          .then((pay) => {
            logger.info({
              message:
                "Payment Callback called and status updated in payment database!",
              user: id,
              orderId: payment.orderId,
              req: {
                query: { payment_id, payment_status, payment_request_id },
              },
            });
            res.redirect(`${orderWebRoute}?id=${payment.orderId}`);
          })
          .catch(() => {
            logger.error({
              message:
                "Payment Callback called and status not updated in payment database!",
              user: id,
              orderId: payment.orderId,
              req: {
                query: { payment_id, payment_status, payment_request_id },
              },
            });
            res.redirect(shopWebRoute);
          });
      }
    }
  );
};

export const getOrdersAdmin = (req: any, res: any) => {
  const skip = !isNaN(toNumber(req.query.skip)) ? toNumber(req.query.skip) : 0;
  const limit = !isNaN(toNumber(req.query.limit))
    ? toNumber(req.query.limit)
    : 0;
  const query: FilterQuery<IOrder> = {};
  const { keywords, products = [], user } = req.query;
  if (keywords) {
    if (isValidObjectId(keywords)) {
      query._id = keywords;
    } else {
      const regex = { $regex: keywords, $options: "i" };
      query.$or = [{ name: regex }, { orderNo: regex }];
    }
  }

  if (isArray(products) && products.length > 0) {
    clearKeysAndAppendObject(query, "items.product", { $in: products });
  }

  if (user) {
    clearKeysAndAppendObject(query, "user", user);
  }

  OrderModel.find(query)
    .populate(["address", "payment", "user", "items.product"])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then(async (orders) => {
      const total = await OrderModel.find(query).countDocuments();
      res.send({ success: true, items: orders, total });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while fetching orders!" });
    });
};

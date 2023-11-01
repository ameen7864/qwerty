"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAdmin = exports.complete = exports.pay = exports.getMyOrders = exports.changeOrderStatus = exports.getOrderSummeryAdmin = exports.verifyRazorpayOrder = exports.createRazorpayOrder = exports.getOrderSummery = exports.create = void 0;
const lodash_1 = require("lodash");
const order_model_1 = __importDefault(require("./models/order.model"));
const utils_1 = require("./utils");
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = __importStar(require("../../config/config"));
const crypto_1 = require("crypto");
const payment_model_1 = __importDefault(require("./models/payment.model"));
// @ts-ignore
const instamojo_nodejs_1 = __importDefault(require("instamojo-nodejs"));
const winston_1 = __importDefault(require("../../config/winston"));
const mongoose_1 = require("mongoose");
const others_1 = require("../utils/others");
const product_model_1 = __importDefault(require("../product/models/product.model"));
const findQuantityInItems = (items, product) => {
    const products = (0, lodash_1.filter)(items, (item) => item.product === product);
    return (0, lodash_1.get)(products, "[0].quantity", 0);
};
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    const { items, device } = req.body;
    if (!items || !(0, lodash_1.isArray)(items) || items.length === 0)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    const orderNo = yield (0, utils_1.generateOrderId)();
    const products = (0, lodash_1.map)(items, (item) => item.product);
    product_model_1.default.find({ _id: { $in: products } })
        .then((products) => {
        let total = 0;
        let deliveryCharges = 0;
        const pros = (0, lodash_1.map)(products, (product) => {
            const quantity = findQuantityInItems(items, (0, lodash_1.toString)(product._id));
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
            }
            else {
                return undefined;
            }
        });
        if (total < 100000) {
            total += 3000;
            deliveryCharges = 3000;
        }
        if (items.indexOf(undefined) === -1) {
            new order_model_1.default({
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
                else
                    res.send({ success: true, order: saved });
            });
        }
        else {
            res.send({ success: false, msg: "Error while creating order!" });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while getting product details!" });
    });
});
exports.create = create;
const getOrderSummery = (req, res) => {
    const { id } = req.query;
    order_model_1.default.findOne({ orderNo: id })
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
        if (!order)
            res.send({ success: false, msg: "Order not found!" });
        else
            res.send({ success: true, order });
    })
        .catch((err) => res.send({ success: false, msg: "Error while processing request!" }));
};
exports.getOrderSummery = getOrderSummery;
const createRazorpayOrder = (req, res) => {
    try {
        const { id } = req.payload;
        const { orderNo, currency = "INR" } = req.body;
        const razorpay = new razorpay_1.default({
            key_id: config_1.razorpayKey,
            key_secret: config_1.razorpaySecret,
        });
        order_model_1.default.findOne({ orderNo })
            .populate("items.product")
            .then((dbOrder) => {
            if (!dbOrder)
                res.send({ success: false, msg: "Order not found!" });
            else {
                let total = 0;
                (0, lodash_1.forEach)((0, lodash_1.get)(dbOrder, "items", []), (item) => {
                    total += item.effectivePrice * item.quantity;
                });
                razorpay.orders.create({ amount: total, currency, receipt: orderNo }, (err, order) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err)
                        res.send({
                            success: false,
                            msg: "Error while creating payment!",
                        });
                    else {
                        const payment = new payment_model_1.default({
                            user: id,
                            orderId: order.id,
                            order: dbOrder._id,
                        });
                        payment.save((err, saved) => {
                            if (err) {
                                res.send({ success: false, msg: "Failed to create order" });
                            }
                            else
                                res.send({
                                    success: true,
                                    order,
                                    key: config_1.razorpayKey,
                                    payment: saved._id,
                                });
                        });
                    }
                }));
            }
        })
            .catch((err) => res.send({ success: false, msg: "Error while fetching order!" }));
    }
    catch (err) {
        res.send({ success: false, msg: "Error while processing request!" });
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
const verifyRazorpayOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment, } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const generated = (0, crypto_1.createHmac)("sha256", config_1.razorpaySecret)
            .update(sign)
            .digest("hex");
        if (generated === razorpay_signature) {
            res.send({ success: true, msg: "Razorpay Payment verified!" });
        }
        else
            res.send({ success: false, msg: "Razorpay Payment not verified!" });
    }
    catch (err) {
        res.send({ success: false, msg: "Error while verifying!" });
    }
});
exports.verifyRazorpayOrder = verifyRazorpayOrder;
const getOrderSummeryAdmin = (req, res) => {
    const { order } = req.query;
    order_model_1.default.findById(order)
        .populate([
        { path: "items.product", populate: ["brand", "category", "subcategory"] },
        { path: "user", select: "firstName lastName email mobile" },
        { path: "address" },
        { path: "payment" },
    ])
        .then((order) => {
        if (!order)
            res.send({ success: false, msg: "Order not found!" });
        else
            res.send({ success: true, order });
    })
        .catch((err) => res.send({ success: false, msg: "Error while fetching order!", err }));
};
exports.getOrderSummeryAdmin = getOrderSummeryAdmin;
const changeOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderNo, orderStatus, isPaid, isFailed, paymentStatus, payment, razorpay_payment_id, razorpay_signature, address, } = req.body;
    yield payment_model_1.default.updateOne({ _id: payment }, {
        $set: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        },
    });
    order_model_1.default.updateOne({ orderNo }, {
        $set: {
            orderStatus,
            isPaid,
            isFailed,
            paymentStatus,
            payment,
            address,
            date: new Date(),
        },
    })
        .then(() => {
        res.send({ success: true, msg: "Order Placed!" });
    })
        .catch((err) => {
        console.log(err);
        res.send({ success: false, msg: "Error while Placing Order!" });
    });
});
exports.changeOrderStatus = changeOrderStatus;
const getMyOrders = (req, res) => {
    try {
        const { skip, limit, keywords } = req.query;
        let qSkip = 0;
        let qLimit = 20;
        if (!(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)))
            qSkip = (0, lodash_1.toNumber)(skip);
        if (!(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)))
            qLimit = (0, lodash_1.toNumber)(limit);
        const { id } = req.payload;
        const query = {
            user: id,
            $or: [],
        };
        const regex = { $regex: keywords, $options: "i" };
        if (keywords) {
            query.$or.push({ orderNo: regex });
        }
        else {
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
        order_model_1.default.find(query)
            .sort({ date: -1 })
            .skip(qSkip)
            .limit(qLimit)
            .populate(populate)
            .then((orders) => {
            order_model_1.default.find(query)
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
    }
    catch (err) {
        res.send({ success: false, msg: "Error while fetching orders!" });
    }
};
exports.getMyOrders = getMyOrders;
const getRedirectUrl = () => {
    return `${config_1.default.env === "development"
        ? `http://localhost:${config_1.default.port}`
        : "https://napi.manubrothers.com"}/orders/complete`;
};
const pay = (req, res) => {
    const { order, address } = req.body;
    const { id } = req.payload;
    if (!order)
        return res.send({ success: false, msg: "Order number not found!" });
    order_model_1.default.findOne({ orderNo: order })
        .populate({ path: "user", select: "email firstName lastName mobile" })
        .then((order) => __awaiter(void 0, void 0, void 0, function* () {
        if (order) {
            yield order_model_1.default.updateOne({ _id: order._id }, { $set: { address } });
            instamojo_nodejs_1.default.setKeys(config_1.instamojoApiKey, config_1.instamojoAuthToken);
            instamojo_nodejs_1.default.isSandboxMode(config_1.default.env === "development");
            const redirectUrl = getRedirectUrl();
            const total = order.total;
            const data = instamojo_nodejs_1.default.PaymentData();
            data.purpose = `Order No ${order.orderNo} Payment`;
            data.amount = total / 100;
            data.buyer_name = `${(0, lodash_1.get)(order, "user.firstName")} ${(0, lodash_1.get)(order, "user.lastName")}`;
            data.redirect_url = redirectUrl;
            if ((0, lodash_1.get)(order, "user.mobile")) {
                data.mobile = (0, lodash_1.get)(order, "user.mobile");
            }
            if ((0, lodash_1.get)(order, "user.email")) {
                data.email = (0, lodash_1.get)(order, "user.email");
            }
            data.allow_repeated_payments = "False";
            data.currency = "INR";
            winston_1.default.info({
                message: "Payment Capture on instamojo started",
                user: id,
                order: order._id,
            });
            // @ts-ignore
            instamojo_nodejs_1.default.createPayment(data, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    winston_1.default.error({
                        message: "Payment not for Created on instamojo",
                        user: id,
                        order: order._id,
                        error: err,
                    });
                    res.send({ success: false, msg: "Error while making payment!" });
                }
                else {
                    const jsonResponse = JSON.parse(response);
                    winston_1.default.info({
                        message: "Payment Created on instamojo",
                        user: id,
                        order: order._id,
                        paymentObject: (0, lodash_1.get)(jsonResponse, "payment_request"),
                    });
                    const payment = new payment_model_1.default({
                        instamojoPaymentObject: (0, lodash_1.get)(jsonResponse, "payment_request"),
                        paymentRequestId: (0, lodash_1.get)(jsonResponse, "payment_request.id"),
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
                            winston_1.default.info({
                                message: "Instamojo Payment Saved in local database",
                                user: id,
                                order: order._id,
                                paymentId: pay._id,
                                paymentObject: (0, lodash_1.get)(jsonResponse, "payment_request"),
                            });
                            res.send({
                                success: true,
                                url: jsonResponse.payment_request.longurl,
                            });
                        }
                        else {
                            winston_1.default.error({
                                message: `Instamojo Error occured, message: ${jsonResponse.message}`,
                                user: id,
                                order: order._id,
                                paymentObject: (0, lodash_1.get)(jsonResponse, "payment_request"),
                            });
                            res.send({
                                success: false,
                                msg: "Error while creating payment!",
                            });
                        }
                    })
                        .catch((err) => {
                        console.log(err);
                        winston_1.default.info({
                            message: "Payment not Created on instamojo",
                            user: id,
                            order: order._id,
                            error: err,
                        });
                    });
                }
            }));
        }
        else
            return res.send({ success: false, msg: "Order not found!" });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while getting order details!" });
    });
};
exports.pay = pay;
const complete = (req, res) => {
    const { payment_id, payment_status, payment_request_id } = req.query;
    const { id } = req.payload;
    payment_model_1.default.findOne({ paymentRequestId: payment_request_id }).then((payment) => __awaiter(void 0, void 0, void 0, function* () {
        if (!payment) {
            winston_1.default.error({
                message: "Payment Callback called but failed to find in database",
                user: id,
                req: { query: { payment_id, payment_status, payment_request_id } },
            });
            res.redirect(config_1.shopWebRoute);
        }
        else {
            payment.status = (0, lodash_1.toString)(payment_status);
            payment.paymentId = (0, lodash_1.toString)(payment_id);
            winston_1.default.info({
                message: "Payment Callback called and status update started!",
                user: id,
                req: { query: { payment_id, payment_status, payment_request_id } },
            });
            yield payment.save();
            if (payment_status === "Credit") {
                yield order_model_1.default.updateOne({ _id: payment.order }, {
                    $set: {
                        isPaid: true,
                        isFailed: false,
                        paymentStatus: "success",
                        orderStatus: "success",
                        payment: payment._id,
                    },
                }).catch(() => {
                    winston_1.default.error({
                        message: "Payment Callback called and status not updated in order database!",
                        user: id,
                        orderId: payment.orderId,
                        req: {
                            query: { payment_id, payment_status, payment_request_id },
                        },
                    });
                });
            }
            else
                yield order_model_1.default.updateOne({ _id: payment.order }, {
                    $set: {
                        isPaid: false,
                        isFailed: true,
                        paymentStatus: "failed",
                        orderStatus: "failed",
                    },
                }).catch(() => {
                    winston_1.default.error({
                        message: "Payment Callback called and status not updated in order database!",
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
                winston_1.default.info({
                    message: "Payment Callback called and status updated in payment database!",
                    user: id,
                    orderId: payment.orderId,
                    req: {
                        query: { payment_id, payment_status, payment_request_id },
                    },
                });
                res.redirect(`${config_1.orderWebRoute}?id=${payment.orderId}`);
            })
                .catch(() => {
                winston_1.default.error({
                    message: "Payment Callback called and status not updated in payment database!",
                    user: id,
                    orderId: payment.orderId,
                    req: {
                        query: { payment_id, payment_status, payment_request_id },
                    },
                });
                res.redirect(config_1.shopWebRoute);
            });
        }
    }));
};
exports.complete = complete;
const getOrdersAdmin = (req, res) => {
    const skip = !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(req.query.skip)) ? (0, lodash_1.toNumber)(req.query.skip) : 0;
    const limit = !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(req.query.limit))
        ? (0, lodash_1.toNumber)(req.query.limit)
        : 0;
    const query = {};
    const { keywords, products = [], user } = req.query;
    if (keywords) {
        if ((0, mongoose_1.isValidObjectId)(keywords)) {
            query._id = keywords;
        }
        else {
            const regex = { $regex: keywords, $options: "i" };
            query.$or = [{ name: regex }, { orderNo: regex }];
        }
    }
    if ((0, lodash_1.isArray)(products) && products.length > 0) {
        (0, others_1.clearKeysAndAppendObject)(query, "items.product", { $in: products });
    }
    if (user) {
        (0, others_1.clearKeysAndAppendObject)(query, "user", user);
    }
    order_model_1.default.find(query)
        .populate(["address", "payment", "user", "items.product"])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .then((orders) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield order_model_1.default.find(query).countDocuments();
        res.send({ success: true, items: orders, total });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while fetching orders!" });
    });
};
exports.getOrdersAdmin = getOrdersAdmin;

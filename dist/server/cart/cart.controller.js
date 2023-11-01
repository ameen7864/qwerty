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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuantity = exports.removeAll = exports.remove = exports.get = exports.add = void 0;
const lodash_1 = __importStar(require("lodash"));
const cart_model_1 = __importDefault(require("./cart.model"));
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../utils/auth");
const add = (req, res) => {
    const { user, device, product, quantity } = req.body;
    if ((!user && !device) || !product || !quantity)
        return res.send({ success: false, msg: "Please enter valid parameters!" });
    const query = {};
    if (user)
        query.user = user;
    else
        query.device = device;
    query.isArchived = false;
    query.product = product;
    cart_model_1.default.findOne(query)
        .then((cart) => {
        if (!cart) {
            new cart_model_1.default({ user, device, product, quantity }).save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while adding!" });
                else {
                    req.query.user = user;
                    req.query.device = device;
                    (0, exports.get)(req, res);
                }
            });
        }
        else {
            cart.quantity += quantity;
            cart.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while adding!" });
                else {
                    req.query.user = user;
                    req.query.device = device;
                    (0, exports.get)(req, res);
                }
            });
        }
    })
        .catch((Err) => res.send({ success: false, msg: "Error while adding to cart!" }));
};
exports.add = add;
const get = (req, res) => {
    const { device, user } = req.query;
    const query = {};
    if (device)
        query.device = device;
    if (user) {
        const token = (0, auth_1.getTokenFromReq)(req);
        if (token) {
            const payload = (0, jwt_1.verifyJWT)(token);
            if (payload && lodash_1.default.get(payload, "id")) {
                if (lodash_1.default.get(payload, "role") === "user")
                    query.user = lodash_1.default.get(payload, "id");
                else
                    query.user = user;
            }
        }
        else {
            return res.send({ success: false, msg: "Authentication is required!" });
        }
    }
    query.isArchived = false;
    cart_model_1.default.find(query)
        .populate([
        {
            path: "product",
            select: "name brand price mainImage discountAmount currentDiscount",
            populate: { path: "brand", select: "name" },
        },
    ])
        .then((items) => res.send({ success: true, items }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while loading cart!" });
    });
};
exports.get = get;
const remove = (req, res) => {
    const { id } = req.query;
    cart_model_1.default.findById(id)
        .then((cart) => {
        if (!cart)
            res.send({ success: false, msg: "Item not found!" });
        else {
            cart.isArchived = true;
            cart.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Item not removed!" });
                else {
                    req.query.user = (0, lodash_1.toString)(cart.user);
                    req.query.device = (0, lodash_1.toString)(cart.device);
                    (0, exports.get)(req, res);
                }
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while removing item!" });
    });
};
exports.remove = remove;
const removeAll = (req, res) => {
    const { device, user } = req.query;
    if (!device && !user)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    const query = {};
    if (device)
        query.device = device;
    if (user)
        query.user = user;
    query.isArchived = false;
    cart_model_1.default.updateMany(query, { $set: { isArchived: true } })
        .then((cart) => {
        res.send({ success: true, msg: "All items removed!" });
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while removing items!" });
    });
};
exports.removeAll = removeAll;
const updateQuantity = (req, res) => {
    const { _id, quantity } = req.body;
    if (!_id || !quantity)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    cart_model_1.default.findById(_id)
        .then((cart) => {
        if (!cart)
            res.send({ success: false, msg: "Cart not found!" });
        else {
            cart.quantity = quantity;
            cart.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Quantity not updated!" });
                else
                    res.send({ success: true, msg: "Quantity updated!" });
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while getting cart!" });
    });
};
exports.updateQuantity = updateQuantity;

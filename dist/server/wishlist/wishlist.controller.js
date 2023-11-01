"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAll = exports.remove = exports.get = exports.add = void 0;
const lodash_1 = require("lodash");
const wishlist_model_1 = __importDefault(require("./wishlist.model"));
const add = (req, res) => {
    const { product, device, user } = req.body;
    if (!product || (!device && !user))
        return res.send({ success: false, msg: "Please send proper parameters!" });
    new wishlist_model_1.default({ product, device, user }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Error while adding!" });
        else {
            req.query.device = device;
            req.query.user = user;
            (0, exports.get)(req, res);
        }
    });
};
exports.add = add;
const get = (req, res) => {
    const { device, user } = req.query;
    const query = {};
    if (device)
        query.device = device;
    if (user)
        query.user = user;
    query.isArchived = false;
    wishlist_model_1.default.find(query)
        .populate({
        path: "product",
        select: "name brand mainImage price discountAmount currentDiscount",
        populate: [{ path: "brand", select: "name" }],
    })
        .then((items) => {
        res.send({ success: true, items });
    })
        .catch((err) => res.send({ success: false, msg: "Error while loading wishlist!" }));
};
exports.get = get;
const remove = (req, res) => {
    const { id } = req.query;
    wishlist_model_1.default.findById(id).then((wish) => {
        if (wish) {
            wish.isArchived = true;
            wish.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while removing item!" });
                else {
                    req.query.user = (0, lodash_1.toString)(wish.user);
                    req.query.device = (0, lodash_1.toString)(wish.device);
                    (0, exports.get)(req, res);
                }
            });
        }
        else
            res.send({ success: false, msg: "Item not found!" });
    });
};
exports.remove = remove;
const removeAll = (req, res) => {
    const { user, device } = req.query;
    if (!user && !device)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    const query = {};
    if (user)
        query.user = user;
    if (device)
        query.device = device;
    query.isArchived = false;
    wishlist_model_1.default.updateMany(query, {
        $set: { isArchived: true },
    })
        .then((updated) => res.send({ success: true, msg: "Items Removed!" }))
        .catch(() => res.send({ success: false, msg: "Error while removing!" }));
};
exports.removeAll = removeAll;

"use strict";
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
exports.getRelatedProducts = exports.addItemToRelatedProducts = exports.generateRandomIndices = exports.updateImages = exports.updateDescription = exports.getSingleProduct = exports.updatePrice = exports.updateByKey = exports.archiveProduct = exports.addQuantity = exports.getProducts = exports.addProduct = exports.getGroupOnlyNames = exports.getGroups = exports.addGroup = void 0;
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const product_model_1 = __importDefault(require("../models/product.model"));
const productGroups_model_1 = __importDefault(require("../models/productGroups.model"));
const auth_1 = require("../../utils/auth");
const producttransactions_model_1 = __importDefault(require("../models/producttransactions.model"));
const prices_model_1 = __importDefault(require("../models/prices.model"));
const randomproductgeneration_model_1 = __importDefault(require("../models/randomproductgeneration.model"));
const addGroup = (req, res) => {
    const { id } = req.payload;
    const { name } = req.body;
    new productGroups_model_1.default({ name, createdBy: id }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Error while adding!" });
        else
            res.send({ success: true, msg: "Group added!" });
    });
};
exports.addGroup = addGroup;
const getGroups = (req, res) => {
    const { role } = req.payload;
    const { keywords, skip, limit } = req.query;
    const query = {};
    let qSkip = 0;
    let qLimit = 50;
    if (role !== "admin")
        query.isArchived = false;
    if (skip && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)))
        qSkip = (0, lodash_1.toNumber)(skip);
    if (limit && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)))
        qLimit = (0, lodash_1.toNumber)(limit);
    if (keywords) {
        const regex = { $regex: keywords, $options: "i" };
        query.$or = [];
        query.$or.push({ name: regex });
        if ((0, mongoose_1.isValidObjectId)(keywords))
            query.$or.push({ _id: keywords });
    }
    productGroups_model_1.default.find(query)
        .populate([
        { path: "products", select: "name" },
        { path: "createdBy", select: "displayName role" },
    ])
        .skip(qSkip)
        .limit(qLimit)
        .sort({ createdAt: -1 })
        .then((groups) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield productGroups_model_1.default.find(query).countDocuments();
        res.send({ success: true, groups, total });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while loading groups!" });
    });
};
exports.getGroups = getGroups;
const getGroupOnlyNames = (req, res) => {
    productGroups_model_1.default.find({})
        .select("name")
        .sort({ createdAt: -1 })
        .then((groups) => res.send({ success: true, groups }))
        .catch((err) => res.send({ success: false, msg: "Error while loading groups!" }));
};
exports.getGroupOnlyNames = getGroupOnlyNames;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    const { name, description, image, otherImages, brand, subcategory, category, scent, price, weight, newArrival, bestseller, group, quantity, sticks, } = req.body;
    if (!name ||
        !image ||
        !brand ||
        !subcategory ||
        !category ||
        !scent ||
        !price ||
        (!weight && !sticks) ||
        newArrival === undefined ||
        bestseller === undefined) {
        return res.send({ success: false, msg: "Please send proper parameters!" });
    }
    new product_model_1.default({
        name,
        description,
        mainImage: image,
        otherImages,
        brand,
        subcategory,
        category,
        scent,
        price,
        weight,
        newArrival,
        bestseller,
        group,
        quantity,
        createdBy: id,
        randomIndex: yield generateRandomId(),
    }).save((err, saved) => {
        if (err) {
            console.log(err);
            res.send({ success: false, msg: "Error while saving data!" });
        }
        else {
            if (group) {
                productGroups_model_1.default.findById(group)
                    .then((group) => {
                    if (!group)
                        res.send({ success: false, msg: "Group not found!" });
                    else {
                        group.products.push(saved._id);
                        group.save((err) => {
                            if (err)
                                res.send({
                                    success: false,
                                    msg: "Error on adding to group!",
                                });
                            else
                                res.send({ success: true, msg: "Product saved!" });
                        });
                    }
                })
                    .catch((err) => {
                    res.send({ success: false, msg: "Error while fetching group!" });
                });
            }
            else
                res.send({ success: true, msg: "Product saved!" });
        }
    });
});
exports.addProduct = addProduct;
const getProducts = (req, res) => {
    const { keywords, skip, limit, brands, subcategories, scents } = req.query;
    const query = {};
    let qSkip = 0;
    let qLimit = 50;
    if (keywords) {
        query.$or = [];
        const regex = { $regex: keywords, $options: "i" };
        query.$or.push({ name: regex });
        if ((0, mongoose_1.isValidObjectId)(keywords))
            query.$or.push({ _id: keywords });
    }
    if (!req.payload || !(0, auth_1.isAdmin)(req.payload.role))
        query.isArchived = { $ne: true };
    if (brands)
        query.brand = { $in: (0, lodash_1.split)((0, lodash_1.toString)(brands), ",") };
    if (subcategories)
        query.subcategory = { $in: (0, lodash_1.split)((0, lodash_1.toString)(subcategories), ",") };
    if (scents)
        query.scent = { $in: (0, lodash_1.split)((0, lodash_1.toString)(scents), ",") };
    if (skip && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)))
        qSkip = (0, lodash_1.toNumber)(skip);
    if (limit && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)))
        qLimit = (0, lodash_1.toNumber)(limit);
    product_model_1.default.find(query)
        .skip(qSkip)
        .limit(qLimit)
        .populate([
        { path: "createdBy", select: "displayName role" },
        { path: "subcategory", select: "name" },
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
        { path: "scent", select: "name" },
    ])
        .sort({ createdAt: -1 })
        .then((products) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield product_model_1.default.find(query).countDocuments();
        res.send({ success: true, products, total });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while loading products!", err });
    });
};
exports.getProducts = getProducts;
const addQuantity = (req, res) => {
    const { id: payloadId } = req.payload;
    const { id, quantity: bodyQuantity } = req.body;
    if (!id || !bodyQuantity || (0, lodash_1.isNaN)((0, lodash_1.toNumber)(bodyQuantity)))
        return res.send({ success: false, msg: "Please send proper paramteres!" });
    const quantity = (0, lodash_1.toNumber)(bodyQuantity);
    product_model_1.default.findById(id)
        .select("quantity")
        .then((pro) => {
        if (pro) {
            new producttransactions_model_1.default({
                product: id,
                user: payloadId,
                entryType: "credit",
                quantity,
                closing: quantity + pro.quantity,
            }).save((err) => {
                if (err) {
                    res.send({
                        success: false,
                        msg: "Error while saving transaction!",
                    });
                }
                else {
                    pro.quantity = quantity + pro.quantity;
                    pro.save((err) => {
                        if (err) {
                            res.send({
                                success: false,
                                msg: "Error while updating on product, transaction saved!",
                            });
                        }
                        else {
                            res.send({ success: true, msg: "Transaction saved!" });
                        }
                    });
                }
            });
        }
        else
            res.send({ success: false, msg: "Product not found!" });
    })
        .catch((err) => res.send({ success: false, msg: "Error while loading product!" }));
};
exports.addQuantity = addQuantity;
const archiveProduct = (req, res) => {
    const { id, action } = req.query;
    if (!id)
        return res.send({ success: false, msg: "Id is not sent!" });
    product_model_1.default.findOne({ _id: id })
        .then((pro) => {
        if (!pro) {
            res.send({ success: false, msg: "Product not found!" });
        }
        else {
            pro.isArchived = action === "archive";
            pro.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while updating status!" });
                else
                    res.send({ success: true, msg: "Product updated!" });
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while loading product!" });
    });
};
exports.archiveProduct = archiveProduct;
const updateByKey = (req, res) => {
    const { id, key, value } = req.body;
    const blankFields = ["weight", "sticks", "currentDiscount"];
    if (!id || (!blankFields.includes(key) && !value))
        return res.send({ success: false, msg: "Please send proper parameters!" });
    product_model_1.default.findById(id)
        .then((pro) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else {
            // @ts-ignore
            pro[key] = value;
            if (!pro.randomIndex) {
                pro.randomIndex = yield generateRandomId();
            }
            if (key === "currentDiscount") {
                pro.discountAmount = pro.price * (value / 100);
            }
            pro.save((err) => {
                if (err) {
                    console.log(err);
                    res.send({ success: false, msg: "Error while updating!" });
                }
                else
                    res.send({ success: true, msg: "Product updated!" });
            });
        }
    }))
        .catch((err) => res.send({ success: false, msg: "Error while loading product!" }));
};
exports.updateByKey = updateByKey;
const updatePrice = (req, res) => {
    const { id } = req.payload;
    const { price, product } = req.body;
    if (!price || !product)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    product_model_1.default.findById(product)
        .then((pro) => __awaiter(void 0, void 0, void 0, function* () {
        if (pro) {
            yield new prices_model_1.default({
                changedBy: id,
                changedOn: new Date(),
                price,
                product,
            }).save();
            pro.price = price;
            if (!pro.randomIndex) {
                pro.randomIndex = yield generateRandomId();
            }
            pro.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while updating product!" });
                else
                    res.send({ success: true, msg: "Price updated!" });
            });
        }
        else
            res.send({ success: false, msg: "Product not found!" });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while getting product!" });
    });
};
exports.updatePrice = updatePrice;
const getSingleProduct = (req, res) => {
    const { id } = req.query;
    if (!id)
        return res.send({ success: false, msg: "Id is not sent!" });
    product_model_1.default.findById(id)
        .populate([
        { path: "brand", select: "name" },
        { path: "scent", select: "name" },
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
        { path: "relatedProducts" },
    ])
        .then((pro) => {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else
            res.send({ success: true, product: pro });
    });
};
exports.getSingleProduct = getSingleProduct;
const updateDescription = (req, res) => {
    const { id, description } = req.body;
    if (!id || !(0, mongoose_1.isValidObjectId)(id) || !description)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    product_model_1.default.findById(id)
        .then((pro) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else {
            pro.description = description;
            if (!pro.randomIndex) {
                pro.randomIndex = yield generateRandomId();
            }
            pro.save((err) => {
                if (err)
                    res.send({
                        success: false,
                        msg: "Error while updating product!",
                    });
                else
                    res.send({ success: true, msg: "Images updated!" });
            });
        }
    }))
        .catch((err) => res.send({ success: false, msg: "Error while fetching product!" }));
};
exports.updateDescription = updateDescription;
const updateImages = (req, res) => {
    const { id, mainImage, otherImages } = req.body;
    if (!id || !(0, mongoose_1.isValidObjectId)(id) || !mainImage)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    product_model_1.default.findById(id)
        .then((pro) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else {
            pro.mainImage = mainImage;
            pro.otherImages = otherImages;
            if (!pro.randomIndex) {
                pro.randomIndex = yield generateRandomId();
            }
            pro.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while updating product!" });
                else
                    res.send({ success: true, msg: "Images updated!" });
            });
        }
    }))
        .catch((err) => res.send({ success: false, msg: "Error while fetching product!" }));
};
exports.updateImages = updateImages;
const generateRandomId = () => __awaiter(void 0, void 0, void 0, function* () {
    let rand = (0, lodash_1.random)(1, 10000000, false);
    let generated = false;
    while (!generated) {
        const pro = yield product_model_1.default.findOne({ randomIndex: rand });
        if (!pro)
            generated = true;
        else
            rand = (0, lodash_1.random)(1, 10000000, false);
    }
    return rand;
});
const updateProductRandom = (product) => __awaiter(void 0, void 0, void 0, function* () {
    product.randomIndex = yield generateRandomId();
    yield product.save().then();
});
const generateRandomIndices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.payload;
        randomproductgeneration_model_1.default.create({ user: id });
        const products = yield product_model_1.default.find({});
        for (let i = 0; i < products.length; i++) {
            yield updateProductRandom(products[i]);
        }
    }
    catch (err) {
        res.send({
            success: false,
            msg: "Error while processing your request",
            err,
        });
    }
});
exports.generateRandomIndices = generateRandomIndices;
const addItemToRelatedProducts = (req, res) => {
    const { id, product: idToAdd } = req.body;
    product_model_1.default.findById(id)
        .then((pro) => {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else {
            let proExist = false;
            (0, lodash_1.forEach)(pro.relatedProducts, (pros) => {
                if ((0, lodash_1.toString)(pros) === (0, lodash_1.toString)(idToAdd))
                    proExist = true;
            });
            if (!proExist)
                pro.relatedProducts.push(idToAdd);
            pro.save((err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    res.send({ success: false, msg: "Error while saving product!" });
                else {
                    product_model_1.default.findById(idToAdd)
                        .then((pr) => {
                        if (!pr)
                            res.send({
                                success: false,
                                msg: "Error while updating product",
                            });
                        else {
                            let proExist = false;
                            (0, lodash_1.forEach)(pr.relatedProducts, (pros) => {
                                if ((0, lodash_1.toString)(pros) === (0, lodash_1.toString)(id))
                                    proExist = true;
                            });
                            if (!proExist)
                                pr.relatedProducts.push(id);
                            pr.save((err) => {
                                if (err) {
                                    res.send({ success: false, msg: "Product not updated!" });
                                }
                                else {
                                    res.send({ success: true, msg: "Product Updated!" });
                                }
                            });
                        }
                    })
                        .catch((err) => res.send({
                        success: false,
                        msg: "Error while getting Product!",
                    }));
                }
            }));
        }
    })
        .catch((err) => res.send({ success: false, msg: "Error while finding products!" }));
};
exports.addItemToRelatedProducts = addItemToRelatedProducts;
const getRelatedProducts = (req, res) => {
    const { id } = req.query;
    if (!id)
        return res.send({ success: false, msg: "Product id not sent!" });
    product_model_1.default.findById(id)
        .populate("relatedProducts")
        .then((pro) => {
        if (!pro)
            res.send({ success: false, msg: "Product not found!" });
        else
            res.send({ success: true, relatedProducts: pro.relatedProducts });
    })
        .catch((err) => res.send({ success: false, msg: "Error while fetching product!" }));
};
exports.getRelatedProducts = getRelatedProducts;

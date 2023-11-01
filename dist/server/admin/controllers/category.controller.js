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
exports.archiveCategory = exports.updateCategory = exports.getCategories = exports.addCategory = void 0;
const lodash_1 = require("lodash");
const categories_model_1 = __importDefault(require("../models/categories.model"));
const addCategory = (req, res) => {
    const { id } = req.payload;
    const { name, image } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    new categories_model_1.default({ name, image, createdBy: id }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Unable to create category!" });
        else
            res.send({ success: true, msg: "Category created!" });
    });
};
exports.addCategory = addCategory;
const getCategories = (req, res) => {
    const { keywords, skip, limit } = req.query;
    let qSkip = 0;
    let qLimit = 50;
    const query = {};
    if (keywords)
        query.name = keywords;
    if (!req.payload || req.payload.role === "staff")
        query.isArchived = false;
    if (limit && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)))
        qLimit = (0, lodash_1.toNumber)(limit);
    if (skip && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)))
        qSkip = (0, lodash_1.toNumber)(skip);
    categories_model_1.default.find(query)
        .populate({ path: "createdBy", select: "displayName role" })
        .skip(qSkip)
        .limit(qLimit)
        .sort({ createdAt: -1 })
        .then((categories) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield categories_model_1.default.find(query).countDocuments();
        res.send({ success: true, categories, total });
    }))
        .catch((err) => res.send({ success: false, msg: "Unable to fetch categories!" }));
};
exports.getCategories = getCategories;
const updateCategory = (req, res) => {
    const { name, image, id } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    categories_model_1.default.findById(id)
        .then((category) => {
        if (!category)
            res.send({ success: false, msg: "Category doesn't exist!" });
        else {
            category.name = name;
            category.image = image;
            category.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Category updated!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find category!" }));
};
exports.updateCategory = updateCategory;
const archiveCategory = (req, res) => {
    const { id, action } = req.query;
    categories_model_1.default.findById(id)
        .then((category) => {
        if (!category)
            res.send({ success: false, msg: "Category doesn't exist!" });
        else {
            category.isArchived = action === "archive";
            category.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Category archived!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find category!" }));
};
exports.archiveCategory = archiveCategory;

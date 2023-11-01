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
exports.archiveSubCategory = exports.updateSubcategory = exports.getSubcategory = exports.addSubcategory = void 0;
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const subcategories_model_1 = __importDefault(require("../models/subcategories.model"));
const addSubcategory = (req, res) => {
    const { category, name, image } = req.body;
    const { id } = req.payload;
    if (!category || !name)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    new subcategories_model_1.default({ category, name, image, createdBy: id }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Error while adding Sub Category!" });
        else
            res.send({ success: true, msg: "Sub category" });
    });
};
exports.addSubcategory = addSubcategory;
const getSubcategory = (req, res) => {
    const { keywords, skip, limit } = req.query;
    let qSkip = 0;
    let qLimit = 50;
    const query = {};
    const populateQuery = {};
    if (keywords) {
        query.name = { $regex: keywords, $options: "i" };
        populateQuery.name = { $regex: keywords, $options: "i" };
        if ((0, mongoose_1.isValidObjectId)(keywords))
            populateQuery._id = keywords;
    }
    if (!req.payload || req.payload.role === "staff")
        query.isArchived = false;
    if (limit && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)))
        qLimit = (0, lodash_1.toNumber)(limit);
    if (skip && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)))
        qSkip = (0, lodash_1.toNumber)(skip);
    subcategories_model_1.default.find(query)
        .skip(qSkip)
        .limit(qLimit)
        .sort({ createdAt: -1 })
        .populate([
        { path: "category", match: query },
        { path: "createdBy", select: "displayName role" },
    ])
        .then((subcategories) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield subcategories_model_1.default.find(query).countDocuments();
        res.send({ success: true, subcategories, total });
    }))
        .catch((err) => res.send({ success: false, msg: "Unable to fetch Sub Categories!" }));
};
exports.getSubcategory = getSubcategory;
const updateSubcategory = (req, res) => {
    const { category, name, image, id } = req.body;
    subcategories_model_1.default.findById(id)
        .then((sub) => {
        if (!sub)
            res.send({ success: false, msg: "Sub Category not found!" });
        else {
            sub.category = category;
            sub.name = name;
            sub.image = image;
            sub.save((err) => {
                if (err)
                    res.send({
                        success: false,
                        msg: "Error while updating Sub Category!",
                    });
                else
                    res.send({ success: true, msg: "Sub Category updated!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Error while getting Sub Category!" }));
};
exports.updateSubcategory = updateSubcategory;
const archiveSubCategory = (req, res) => {
    const { id, action } = req.query;
    subcategories_model_1.default.findById(id)
        .then((sub) => {
        if (!sub)
            res.send({ success: false, msg: "Sub Category doesn't exist!" });
        else {
            sub.isArchived = action === "archive";
            sub.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Sub Category archived!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};
exports.archiveSubCategory = archiveSubCategory;

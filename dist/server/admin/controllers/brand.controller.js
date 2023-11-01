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
exports.archiveBrand = exports.updateBrand = exports.getBrands = exports.addBrand = void 0;
const lodash_1 = require("lodash");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const addBrand = (req, res) => {
    const { id } = req.payload;
    const { name, logo } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    new brand_model_1.default({ name, logo, createdBy: id }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Unable to create brand!" });
        else
            res.send({ success: true, msg: "Brand created!" });
    });
};
exports.addBrand = addBrand;
const getBrands = (req, res) => {
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
    brand_model_1.default.find(query)
        .populate({ path: "createdBy", select: "displayName role" })
        .skip(qSkip)
        .limit(qLimit)
        .sort({ createdAt: -1 })
        .then((brands) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield brand_model_1.default.find(query).countDocuments();
        res.send({ success: true, brands, total });
    }))
        .catch((err) => res.send({ success: false, msg: "Unable to fetch brands!" }));
};
exports.getBrands = getBrands;
const updateBrand = (req, res) => {
    const { name, logo, id } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    brand_model_1.default.findById(id)
        .then((brand) => {
        if (!brand)
            res.send({ success: false, msg: "Brand doesn't exist!" });
        else {
            brand.name = name;
            brand.logo = logo;
            brand.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Brand updated!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find brand!" }));
};
exports.updateBrand = updateBrand;
const archiveBrand = (req, res) => {
    const { id, action } = req.query;
    brand_model_1.default.findById(id)
        .then((brand) => {
        if (!brand)
            res.send({ success: false, msg: "Brand doesn't exist!" });
        else {
            brand.isArchived = action === "archive";
            brand.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Brand archived!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find brand!" }));
};
exports.archiveBrand = archiveBrand;

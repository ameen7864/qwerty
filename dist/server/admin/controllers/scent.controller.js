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
exports.archiveScent = exports.updateScent = exports.getScents = exports.addScent = void 0;
const lodash_1 = require("lodash");
const scent_model_1 = __importDefault(require("../models/scent.model"));
const addScent = (req, res) => {
    const { id } = req.payload;
    const { name, color } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    new scent_model_1.default({ name, color, createdBy: id }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Unable to create scent!" });
        else
            res.send({ success: true, msg: "Scent created!" });
    });
};
exports.addScent = addScent;
const getScents = (req, res) => {
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
    scent_model_1.default.find(query)
        .populate({ path: "createdBy", select: "displayName role" })
        .skip(qSkip)
        .limit(qLimit)
        .sort({ createdAt: -1 })
        .then((scents) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield scent_model_1.default.find(query).countDocuments();
        res.send({ success: true, scents, total });
    }))
        .catch((err) => res.send({ success: false, msg: "Unable to fetch scents!" }));
};
exports.getScents = getScents;
const updateScent = (req, res) => {
    const { name, color, id } = req.body;
    if (!name)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    scent_model_1.default.findById(id)
        .then((scent) => {
        if (!scent)
            res.send({ success: false, msg: "Scent doesn't exist!" });
        else {
            scent.name = name;
            scent.color = color;
            scent.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Scent updated!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};
exports.updateScent = updateScent;
const archiveScent = (req, res) => {
    const { id, action } = req.query;
    scent_model_1.default.findById(id)
        .then((scent) => {
        if (!scent)
            res.send({ success: false, msg: "Scent doesn't exist!" });
        else {
            scent.isArchived = action === "archive";
            scent.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Unable to update!" });
                else
                    res.send({ success: true, msg: "Scent archived!" });
            });
        }
    })
        .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};
exports.archiveScent = archiveScent;

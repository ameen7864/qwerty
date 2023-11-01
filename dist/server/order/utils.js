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
exports.generateOrderId = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const order_model_1 = __importDefault(require("./models/order.model"));
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const generateRandom = () => {
    let ran = `${(0, dayjs_1.default)().get("year")}-`;
    for (let i = 0; i < 9; i++) {
        if (i === 4)
            ran += "-";
        else
            ran += chars[(0, lodash_1.random)(0, chars.length - 1, false)];
    }
    return ran;
};
const generateOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    let done = false;
    while (!done) {
        const ran = generateRandom();
        const order = yield order_model_1.default.findOne({ orderNo: ran }).countDocuments();
        if (order === 0) {
            done = true;
            return ran;
        }
    }
    return null;
});
exports.generateOrderId = generateOrderId;

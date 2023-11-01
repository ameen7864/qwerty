"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToday = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const getToday = (format = "DD MMM YYYY") => {
    return (0, dayjs_1.default)().format(format).toString();
};
exports.getToday = getToday;

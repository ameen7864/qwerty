"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearKeysAndAppendObject = exports.generateRandomElementFromArray = exports.setCookie = exports.getDomainForCookie = void 0;
const lodash_1 = require("lodash");
const config_1 = require("../../config/config");
const dayjs_1 = __importDefault(require("dayjs"));
const getDomainForCookie = () => config_1.env === "development" ? "localhost" : "manubrothers.com";
exports.getDomainForCookie = getDomainForCookie;
const setCookie = (res, name, value) => {
    return res.cookie(name, value, {
        expires: (0, dayjs_1.default)().add(60, "days").toDate(),
        domain: (0, exports.getDomainForCookie)(),
    });
};
exports.setCookie = setCookie;
const generateRandomElementFromArray = (arr) => {
    const length = arr.length - 1;
    return arr[(0, lodash_1.random)(0, length, false)];
};
exports.generateRandomElementFromArray = generateRandomElementFromArray;
const clearKeysAndAppendObject = (obj, key, value) => {
    (0, lodash_1.forEach)(Object.keys(obj), (key) => {
        obj[key] = undefined;
    });
    obj[key] = value;
};
exports.clearKeysAndAppendObject = clearKeysAndAppendObject;

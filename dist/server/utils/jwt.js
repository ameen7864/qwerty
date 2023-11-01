"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const generateJWT = ({ id, role }) => jsonwebtoken_1.default.sign({ id, role }, config_1.jwtSecret, { algorithm: "HS256", expiresIn: "60d" });
exports.generateJWT = generateJWT;
const verifyJWT = (str) => {
    try {
        return jsonwebtoken_1.default.verify(str, config_1.jwtSecret);
    }
    catch (err) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;

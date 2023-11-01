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
const users_model_1 = __importDefault(require("../users/models/users.model"));
const usertoken_model_1 = __importDefault(require("../users/models/usertoken.model"));
const auth_1 = require("../utils/auth");
const jwt_1 = require("../utils/jwt");
const auth_2 = require("../utils/auth");
const auth_3 = require("../utils/auth");
const required = (req, res, next) => {
    const token = (0, auth_1.getTokenFromReq)(req);
    if (!token)
        return (0, auth_1.clearCookies)(res).send({ success: false, msg: "Token not found!" });
    else {
        try {
            const verified = (0, jwt_1.verifyJWT)(token);
            if (!verified)
                return (0, auth_1.clearCookies)(res).send({
                    success: false,
                    msg: "Token not verified!",
                });
            // @ts-ignore
            req.payload = verified;
        }
        catch (err) {
            return (0, auth_1.clearCookies)(res).send({
                success: false,
                msg: "Token not verified!",
            });
        }
    }
    usertoken_model_1.default.findOne({ token, active: true }).then((tok) => {
        if (!tok)
            return (0, auth_1.clearCookies)(res).send({
                sucess: false,
                msg: "Token doesn't exist!",
            });
        else {
            if (!tok.active)
                (0, auth_1.clearCookies)(res).send({
                    success: false,
                    msg: "Token expired!",
                });
            else if (new Date() > tok.expiresAt) {
                (0, auth_1.clearCookies)(res).send({
                    success: false,
                    msg: "Token Deactivated!",
                });
            }
            else {
                next();
            }
        }
    });
};
const optional = (req, res, next) => {
    const token = (0, auth_1.getTokenFromReq)(req);
    req.payload = { id: "", role: "" };
    if (!token)
        next();
    else {
        try {
            const verified = (0, jwt_1.verifyJWT)(token);
            if (verified)
                // @ts-ignore
                req.payload = verified;
            next();
        }
        catch (err) {
            next();
        }
    }
};
const withUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.payload;
        const user = yield users_model_1.default.findById(id);
        if (!user)
            res.send({ success: false, msg: "User not found!" });
        else {
            res.locals.user = user;
            next();
        }
    }
    catch (err) {
        res.send({ success: false, msg: "Error while fetching user!" });
    }
});
const isAdmin = (req, res, next) => {
    if (!(0, auth_2.isAdmin)(req.payload.role))
        res.send({ success: false, msg: "You are not authorised!" });
    else
        next();
};
const isAtLeastStaff = (req, res, next) => {
    if (!(0, auth_3.isAtleastStaff)(req.payload.role))
        res.send({ success: false, msg: "You are not authorised!" });
    else
        next();
};
const auth = { required, withUser, isAdmin, isAtLeastStaff };
module.exports = auth;

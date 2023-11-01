"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAtleastStaff = exports.isAdmin = exports.deactivateToken = exports.clearCookieAndGoBack = exports.clearCookies = exports.getTokenFromReq = exports.rolePriority = exports.USER_ROLES = void 0;
const lodash_1 = require("lodash");
const usertoken_model_1 = __importDefault(require("../users/models/usertoken.model"));
const others_1 = require("./others");
exports.USER_ROLES = {
    user: "user",
    staff: "staff",
    admin: "admin",
};
exports.rolePriority = [
    exports.USER_ROLES.admin,
    exports.USER_ROLES.staff,
    exports.USER_ROLES.user,
];
const getTokenFromReq = (req) => {
    try {
        const { authorization: auth } = req.headers;
        if ((0, lodash_1.get)(req, "cookies.auth") &&
            (0, lodash_1.get)(req, "cookies.auth") !== "null" &&
            (0, lodash_1.get)(req, "cookies.auth") !== "undefined")
            return (0, lodash_1.get)(req, "cookies.auth");
        if (auth) {
            const splitted = (0, lodash_1.split)(auth, " ");
            if ((0, lodash_1.lowerCase)(splitted[0]) === "token" ||
                (0, lodash_1.lowerCase)(splitted[0]) === "bearer")
                if (splitted[1] &&
                    splitted[1] !== "null" &&
                    splitted[1] !== "undefined")
                    return splitted[1];
        }
        return null;
    }
    catch (err) {
        return null;
    }
};
exports.getTokenFromReq = getTokenFromReq;
const clearCookies = (res) => {
    return res.clearCookie("auth", { domain: (0, others_1.getDomainForCookie)() });
};
exports.clearCookies = clearCookies;
const clearCookieAndGoBack = (res) => {
    (0, exports.clearCookies)(res).send({ success: false, msg: "Cookie cleared!" });
};
exports.clearCookieAndGoBack = clearCookieAndGoBack;
const deactivateToken = (token) => {
    return new Promise((resolve, reject) => {
        usertoken_model_1.default.findOne({ token })
            .then((tok) => {
            if (tok) {
                tok.active = false;
                tok.save((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve({ success: true });
                });
            }
            else {
                resolve({ success: true });
            }
        })
            .catch((err) => {
            reject(err);
        });
    });
};
exports.deactivateToken = deactivateToken;
const isSame = (role, toCheck) => {
    if (toCheck === exports.USER_ROLES.admin)
        return true;
    return role === toCheck;
};
const isAtLeast = (role, toCheck) => {
    if (toCheck === exports.USER_ROLES.admin)
        return true;
    const index = exports.rolePriority.indexOf(role);
    const toCheckIndex = exports.rolePriority.indexOf(toCheck);
    return index >= toCheckIndex;
};
const isAdmin = (role) => isSame(exports.USER_ROLES.admin, role);
exports.isAdmin = isAdmin;
const isAtleastStaff = (role) => isAtLeast(exports.USER_ROLES.staff, role);
exports.isAtleastStaff = isAtleastStaff;

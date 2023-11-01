"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserExist = void 0;
const lodash_1 = require("lodash");
const auth_1 = require("../utils/auth");
const jwt_1 = require("../utils/jwt");
const isUserExist = (req, res, next) => {
    const { user } = req.query;
    if (user) {
        const token = (0, auth_1.getTokenFromReq)(req);
        if (!token)
            res.send({ success: false, msg: "Unattended access, Please login!" });
        else {
            const verified = (0, jwt_1.verifyJWT)(token);
            if (verified) {
                if ((0, lodash_1.get)(verified, "id") !== user)
                    res.send({ success: false, msg: "Unattended access, Please login!" });
                else
                    next();
            }
            else
                res.send({ success: false, msg: "Unattended access, Please login!" });
        }
    }
    else {
        next();
    }
};
exports.isUserExist = isUserExist;

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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, index: true },
    mobile: { type: Number, index: true },
    username: { type: String, index: true },
    dp: String,
    countryCode: Number,
    signupType: { type: String, enum: ["mobile", "email", "google"] },
    password: String,
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    verifiedBy: { type: String, enum: ["admin", "google", "otp"] },
    role: { type: String, enum: ["user", "staff", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female", "other"] },
    addedBy: { type: ObjectId, ref: "Users" },
}, { timestamps: true });
schema.method({
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, bcrypt_1.compare)(password, this.password);
        });
    },
});
const UserModel = (0, mongoose_1.model)("Users", schema);
exports.default = UserModel;

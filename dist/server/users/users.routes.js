"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const users_controller_1 = require("./users.controller");
const passport_1 = __importDefault(require("passport"));
const config_1 = require("../../config/config");
const userRouter = (0, express_1.Router)();
userRouter.route("/google/callback").get(passport_1.default.authenticate("google", {
    failureRedirect: config_1.env === "production"
        ? "https://napi.manubrothers.com/users/login/failed"
        : "/users/login/failed",
    successRedirect: config_1.env === "production"
        ? "https://napi.manubrothers.com/users/login/success"
        : "/users/login/success",
    scope: ["profile", "email"],
}));
// @ts-ignore
userRouter.route("/login/failed").get(users_controller_1.handleGoogleLoginFailed);
// @ts-ignore
userRouter.route("/login/success").get(users_controller_1.handleGoogleLoginSuccess);
userRouter
    .route("")
    // @ts-ignore
    .post(auth_1.default.required, auth_1.default.isAdmin, users_controller_1.addUser)
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, users_controller_1.search);
// @ts-ignore
userRouter.route("/create-order-user").post(users_controller_1.createUserForOrder);
userRouter.route("/signup/email").post(users_controller_1.signupByEmail);
// @ts-ignore
userRouter.route("/login").post(users_controller_1.login);
// @ts-ignore
userRouter.route("/get/data").get(users_controller_1.getData);
// @ts-ignore
userRouter.route("/profile").post(auth_1.default.required, users_controller_1.updateProfile);
userRouter
    .route("/logout")
    // @ts-ignore
    .get(auth_1.default.required, users_controller_1.logout)
    // @ts-ignore
    .post(auth_1.default.required, users_controller_1.logoutAll);
// @ts-ignore
userRouter.route("/update-password").post(auth_1.default.required, users_controller_1.updatePassword);
userRouter
    .route("/update-avatar")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.withUser, users_controller_1.updateAvatar);
userRouter
    .route("/address")
    // @ts-ignore
    .get(auth_1.default.required, users_controller_1.getAddresses)
    // @ts-ignore
    .post(auth_1.default.required, users_controller_1.addAddress);
exports.default = userRouter;

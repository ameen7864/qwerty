"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const aws_controller_1 = require("./aws.controller");
const awsRoutes = (0, express_1.Router)();
// @ts-ignore
awsRoutes.route("/get-policy").post(auth_1.default.required, aws_controller_1.getPolicy);
module.exports = awsRoutes;

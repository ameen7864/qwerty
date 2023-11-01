"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const scent_controller_1 = require("../controllers/scent.controller");
const scentRoutes = (0, express_1.Router)();
scentRoutes
    .route("")
    // @ts-ignore
    .get(scent_controller_1.getScents)
    // @ts-ignore
    .post(auth_1.default.isAdmin, scent_controller_1.addScent)
    // @ts-ignore
    .patch(auth_1.default.isAdmin, scent_controller_1.updateScent);
// @ts-ignore
scentRoutes.route("/archive").get(scent_controller_1.archiveScent);
module.exports = scentRoutes;

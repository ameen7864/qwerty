"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const brand_controller_1 = require("../controllers/brand.controller");
const brandRoutes = (0, express_1.Router)();
brandRoutes
    .route("")
    // @ts-ignore
    .get(brand_controller_1.getBrands)
    // @ts-ignore
    .post(auth_1.default.isAdmin, brand_controller_1.addBrand)
    // @ts-ignore
    .patch(auth_1.default.isAdmin, brand_controller_1.updateBrand);
// @ts-ignore
brandRoutes.route("/archive").get(brand_controller_1.archiveBrand);
module.exports = brandRoutes;

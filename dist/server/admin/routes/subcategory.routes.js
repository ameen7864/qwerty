"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subcategory_controller_1 = require("../controllers/subcategory.controller");
const subCategoryRoutes = (0, express_1.Router)();
subCategoryRoutes
    .route("")
    // @ts-ignore
    .get(subcategory_controller_1.getSubcategory)
    // @ts-ignore
    .post(auth_1.default.isAdmin, subcategory_controller_1.addSubcategory)
    // @ts-ignore
    .patch(auth_1.default.isAdmin, subcategory_controller_1.updateSubcategory);
// @ts-ignore
subCategoryRoutes.route("/archive").get(subcategory_controller_1.archiveSubCategory);
module.exports = subCategoryRoutes;

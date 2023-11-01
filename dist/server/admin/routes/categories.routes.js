"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const category_controller_1 = require("../controllers/category.controller");
const categoryRoutes = (0, express_1.Router)();
categoryRoutes
    .route("")
    // @ts-ignore
    .get(category_controller_1.getCategories)
    // @ts-ignore
    .post(auth_1.default.isAdmin, category_controller_1.addCategory)
    // @ts-ignore
    .patch(auth_1.default.isAdmin, category_controller_1.updateCategory);
// @ts-ignore
categoryRoutes.route("/archive").get(category_controller_1.archiveCategory);
module.exports = categoryRoutes;

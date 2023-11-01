"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const brands_routes_1 = __importDefault(require("./routes/brands.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const scents_routes_1 = __importDefault(require("./routes/scents.routes"));
const subcategory_routes_1 = __importDefault(require("./routes/subcategory.routes"));
const adminRoutes = (0, express_1.Router)();
adminRoutes.use("/scents", scents_routes_1.default);
adminRoutes.use("/categories", categories_routes_1.default);
adminRoutes.use("/sub-categories", subcategory_routes_1.default);
adminRoutes.use("/brands", brands_routes_1.default);
module.exports = adminRoutes;

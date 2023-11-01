"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const product_controller_1 = require("./controllers/product.controller");
const productRoutes = (0, express_1.Router)();
productRoutes
    .route("/groups")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.getGroups)
    // @ts-ignore
    .post(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.addGroup);
productRoutes
    .route("/groups/only-names")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.getGroupOnlyNames);
productRoutes
    .route("")
    // @ts-ignore
    .post(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.addProduct)
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.getProducts)
    // @ts-ignore
    .patch(auth_1.default.required, auth_1.default.isAdmin, product_controller_1.updateByKey);
productRoutes
    .route("/update-images")
    // @ts-ignore
    .patch(auth_1.default.required, auth_1.default.isAdmin, product_controller_1.updateImages);
productRoutes
    .route("/update-description")
    // @ts-ignore
    .patch(auth_1.default.required, auth_1.default.isAdmin, product_controller_1.updateDescription);
// @ts-ignore
productRoutes.route("/single").post(product_controller_1.getSingleProduct);
productRoutes
    .route("/quantity")
    // @ts-ignore
    .post(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.addQuantity);
productRoutes
    .route("/archive")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAdmin, product_controller_1.archiveProduct);
productRoutes
    .route("/generate-all-random-ids")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAdmin, product_controller_1.generateRandomIndices);
productRoutes
    .route("/related-products")
    // @ts-ignore
    .get(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.getRelatedProducts)
    // @ts-ignore
    .post(auth_1.default.required, auth_1.default.isAtLeastStaff, product_controller_1.addItemToRelatedProducts);
module.exports = productRoutes;

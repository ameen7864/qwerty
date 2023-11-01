"use strict";
const express_1 = require("express");
const brand_controller_1 = require("../admin/controllers/brand.controller");
const category_controller_1 = require("../admin/controllers/category.controller");
const scent_controller_1 = require("../admin/controllers/scent.controller");
const subcategory_controller_1 = require("../admin/controllers/subcategory.controller");
const users_controller_1 = require("../users/users.controller");
const product_controller_1 = require("../product/controllers/product.controller");
const blog_controller_1 = require("../blog/controller/blog.controller");
const publicRoutes = (0, express_1.Router)();
// @ts-ignore
publicRoutes.route("/brands").get(brand_controller_1.getBrands);
// @ts-ignore
publicRoutes.route("/categories").get(category_controller_1.getCategories);
// @ts-ignore
publicRoutes.route("/sub-categories").get(subcategory_controller_1.getSubcategory);
// @ts-ignore
publicRoutes.route("/scents").get(scent_controller_1.getScents);
// @ts-ignore
publicRoutes.route("/contact-us").post(users_controller_1.addContactUs);
// @ts-ignore
publicRoutes.route("/products").get(product_controller_1.getProducts);
// @ts-ignore
publicRoutes.route("/products/single").get(product_controller_1.getSingleProduct);
// @ts-ignore
publicRoutes.route("/register-device").post(users_controller_1.generateDeviceId);
publicRoutes
    .route("/newsletter")
    // @ts-ignore
    .post(users_controller_1.subscribeNewsletter)
    // @ts-ignore
    .get(users_controller_1.unsubscribeToNewsletter);
// @ts-ignore
publicRoutes.route("/blogs").get((req, res) => {
    // @ts-ignore
    req.query.isPublic = true;
    // @ts-ignore
    (0, blog_controller_1.getBlogs)(req, res);
});
// @ts-ignore
publicRoutes.route("/blogs/:blogId").get(blog_controller_1.getBlogById);
module.exports = publicRoutes;

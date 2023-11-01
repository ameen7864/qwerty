"use strict";
const express_1 = require("express");
const wishlist_controller_1 = require("./wishlist.controller");
const customUser_1 = require("../middlewares/customUser");
const wishlistRouter = (0, express_1.Router)();
wishlistRouter
    .route("")
    // @ts-ignore
    .post(customUser_1.isUserExist, wishlist_controller_1.add)
    // @ts-ignore
    .get(customUser_1.isUserExist, wishlist_controller_1.get)
    // @ts-ignore
    .delete(customUser_1.isUserExist, wishlist_controller_1.remove)
    // @ts-ignore
    .patch(customUser_1.isUserExist, wishlist_controller_1.removeAll);
module.exports = wishlistRouter;

"use strict";
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const CartRoutes = (0, express_1.Router)();
// @ts-ignore
CartRoutes.route("").get(cart_controller_1.get).post(cart_controller_1.add).delete(cart_controller_1.remove).patch(cart_controller_1.removeAll);
// @ts-ignore
CartRoutes.route("/update-quantity").post(cart_controller_1.updateQuantity);
module.exports = CartRoutes;

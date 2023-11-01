"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const index_routes_1 = __importDefault(require("./server/admin/index.routes"));
const aws_routes_1 = __importDefault(require("./server/aws/aws.routes"));
const auth_1 = __importDefault(require("./server/middlewares/auth"));
const newsletter_routes_1 = __importDefault(require("./server/newsletter/newsletter.routes"));
const product_routes_1 = __importDefault(require("./server/product/product.routes"));
const public_routes_1 = __importDefault(require("./server/public/public.routes"));
const users_routes_1 = __importDefault(require("./server/users/users.routes"));
const order_routes_1 = __importDefault(require("./server/order/order.routes"));
const lodash_1 = require("lodash");
const wishlist_route_1 = __importDefault(require("./server/wishlist/wishlist.route"));
const cart_routes_1 = __importDefault(require("./server/cart/cart.routes"));
const blog_routes_1 = __importDefault(require("./server/blog/blog.routes"));
const appRouter = (0, express_1.Router)();
appRouter.get("/health-check", (req, res) => {
    res.send({ success: true, ip: (0, lodash_1.get)(res, "socket.remoteAddress") });
});
// @ts-ignore
appRouter.use("/admin", auth_1.default.required, auth_1.default.isAtLeastStaff, index_routes_1.default);
appRouter.use("/blogs", blog_routes_1.default);
appRouter.use("/products", product_routes_1.default);
appRouter.use("/orders", order_routes_1.default);
appRouter.use("/aws", aws_routes_1.default);
appRouter.use("/public", public_routes_1.default);
appRouter.use("/users", users_routes_1.default);
appRouter.use("/newsletter", newsletter_routes_1.default);
appRouter.use("/cart", cart_routes_1.default);
appRouter.use("/wishlist", wishlist_route_1.default);
module.exports = appRouter;

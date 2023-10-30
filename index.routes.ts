import { Router } from "express";
import adminRoutes from "./server/admin/index.routes";
import awsRoutes from "./server/aws/aws.routes";
import auth from "./server/middlewares/auth";
import NewsletterRouter from "./server/newsletter/newsletter.routes";
import productRoutes from "./server/product/product.routes";
import publicRoutes from "./server/public/public.routes";
import userRouter from "./server/users/users.routes";
import orderRoutes from "./server/order/order.routes";
import { get } from "lodash";
import wishlistRouter from "./server/wishlist/wishlist.route";
import CartRoutes from "./server/cart/cart.routes";
import blogRouter from "./server/blog/blog.routes";

const appRouter = Router();

appRouter.get("/health-check", (req, res) => {
  res.send({ success: true, ip: get(res, "socket.remoteAddress") });
});
// @ts-ignore
appRouter.use("/admin", auth.required, auth.isAtLeastStaff, adminRoutes);
appRouter.use("/blogs", blogRouter);
appRouter.use("/products", productRoutes);
appRouter.use("/orders", orderRoutes);
appRouter.use("/aws", awsRoutes);
appRouter.use("/public", publicRoutes);
appRouter.use("/users", userRouter);
appRouter.use("/newsletter", NewsletterRouter);
appRouter.use("/cart", CartRoutes);
appRouter.use("/wishlist", wishlistRouter);

export = appRouter;

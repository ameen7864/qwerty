import { Router } from "express";
import { getBrands } from "../admin/controllers/brand.controller";
import { getCategories } from "../admin/controllers/category.controller";
import { getScents } from "../admin/controllers/scent.controller";
import { getSubcategory } from "../admin/controllers/subcategory.controller";
import {
  addContactUs,
  generateDeviceId,
  subscribeNewsletter,
  unsubscribeToNewsletter,
} from "../users/users.controller";
import {
  getProducts,
  getSingleProduct,
} from "../product/controllers/product.controller";
import { getBlogById, getBlogs } from "../blog/controller/blog.controller";

const publicRoutes = Router();

// @ts-ignore
publicRoutes.route("/brands").get(getBrands);

// @ts-ignore
publicRoutes.route("/categories").get(getCategories);

// @ts-ignore
publicRoutes.route("/sub-categories").get(getSubcategory);

// @ts-ignore
publicRoutes.route("/scents").get(getScents);

// @ts-ignore
publicRoutes.route("/contact-us").post(addContactUs);

// @ts-ignore
publicRoutes.route("/products").get(getProducts);

// @ts-ignore
publicRoutes.route("/products/single").get(getSingleProduct);

// @ts-ignore
publicRoutes.route("/register-device").post(generateDeviceId);

publicRoutes
  .route("/newsletter")
  // @ts-ignore
  .post(subscribeNewsletter)
  // @ts-ignore
  .get(unsubscribeToNewsletter);

// @ts-ignore
publicRoutes.route("/blogs").get((req, res) => {
  // @ts-ignore
  req.query.isPublic = true;
  // @ts-ignore
  getBlogs(req, res);
});

// @ts-ignore
publicRoutes.route("/blogs/:blogId").get(getBlogById);

export = publicRoutes;

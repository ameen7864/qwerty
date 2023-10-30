import { Router } from "express";
import auth from "../middlewares/auth";
import {
  addGroup,
  addItemToRelatedProducts,
  addProduct,
  addQuantity,
  archiveProduct,
  generateRandomIndices,
  getGroupOnlyNames,
  getGroups,
  getProducts,
  getRelatedProducts,
  getSingleProduct,
  updateByKey,
  updateDescription,
  updateImages,
} from "./controllers/product.controller";

const productRoutes = Router();

productRoutes
  .route("/groups")
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, getGroups)
  // @ts-ignore
  .post(auth.required, auth.isAtLeastStaff, addGroup);

productRoutes
  .route("/groups/only-names")
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, getGroupOnlyNames);

productRoutes
  .route("")
  // @ts-ignore
  .post(auth.required, auth.isAtLeastStaff, addProduct)
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, getProducts)
  // @ts-ignore
  .patch(auth.required, auth.isAdmin, updateByKey);

productRoutes
  .route("/update-images")
  // @ts-ignore
  .patch(auth.required, auth.isAdmin, updateImages);

productRoutes
  .route("/update-description")
  // @ts-ignore
  .patch(auth.required, auth.isAdmin, updateDescription);

// @ts-ignore
productRoutes.route("/single").post(getSingleProduct);

productRoutes
  .route("/quantity")
  // @ts-ignore
  .post(auth.required, auth.isAtLeastStaff, addQuantity);

productRoutes
  .route("/archive")
  // @ts-ignore
  .get(auth.required, auth.isAdmin, archiveProduct);

productRoutes
  .route("/generate-all-random-ids")
  // @ts-ignore
  .get(auth.required, auth.isAdmin, generateRandomIndices);

productRoutes
  .route("/related-products")
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, getRelatedProducts)
  // @ts-ignore
  .post(auth.required, auth.isAtLeastStaff, addItemToRelatedProducts);

export = productRoutes;

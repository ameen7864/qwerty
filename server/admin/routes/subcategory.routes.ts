import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  addSubcategory,
  archiveSubCategory,
  getSubcategory,
  updateSubcategory,
} from "../controllers/subcategory.controller";

const subCategoryRoutes = Router();

subCategoryRoutes
  .route("")
  // @ts-ignore
  .get(getSubcategory)
  // @ts-ignore
  .post(auth.isAdmin, addSubcategory)
  // @ts-ignore
  .patch(auth.isAdmin, updateSubcategory);

// @ts-ignore
subCategoryRoutes.route("/archive").get(archiveSubCategory);

export = subCategoryRoutes;

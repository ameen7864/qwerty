import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  archiveCategory,
  addCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";

const categoryRoutes = Router();

categoryRoutes
  .route("")
  // @ts-ignore
  .get(getCategories)
  // @ts-ignore
  .post(auth.isAdmin, addCategory)
  // @ts-ignore
  .patch(auth.isAdmin, updateCategory);

// @ts-ignore
categoryRoutes.route("/archive").get(archiveCategory);

export = categoryRoutes;

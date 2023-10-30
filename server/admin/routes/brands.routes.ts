import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  addBrand,
  archiveBrand,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller";

const brandRoutes = Router();

brandRoutes
  .route("")
  // @ts-ignore
  .get(getBrands)
  // @ts-ignore
  .post(auth.isAdmin, addBrand)
  // @ts-ignore
  .patch(auth.isAdmin, updateBrand);

// @ts-ignore
brandRoutes.route("/archive").get(archiveBrand);

export = brandRoutes;

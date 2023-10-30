import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  addScent,
  archiveScent,
  getScents,
  updateScent,
} from "../controllers/scent.controller";

const scentRoutes = Router();

scentRoutes
  .route("")
  // @ts-ignore
  .get(getScents)
  // @ts-ignore
  .post(auth.isAdmin, addScent)
  // @ts-ignore
  .patch(auth.isAdmin, updateScent);

// @ts-ignore
scentRoutes.route("/archive").get(archiveScent);

export = scentRoutes;

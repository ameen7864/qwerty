import { Router } from "express";
import { add, get, remove, removeAll } from "./wishlist.controller";
import { isUserExist } from "../middlewares/customUser";

const wishlistRouter = Router();

wishlistRouter
  .route("")
  // @ts-ignore
  .post(isUserExist, add)
  // @ts-ignore
  .get(isUserExist, get)
  // @ts-ignore
  .delete(isUserExist, remove)
  // @ts-ignore
  .patch(isUserExist, removeAll);

export = wishlistRouter;

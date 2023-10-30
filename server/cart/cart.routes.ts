import { Router } from "express";
import { add, get, remove, removeAll, updateQuantity } from "./cart.controller";

const CartRoutes = Router();

// @ts-ignore
CartRoutes.route("").get(get).post(add).delete(remove).patch(removeAll);

// @ts-ignore
CartRoutes.route("/update-quantity").post(updateQuantity);

export = CartRoutes;

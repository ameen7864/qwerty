import { Router } from "express";
import auth from "../middlewares/auth";
import { getPolicy } from "./aws.controller";

const awsRoutes = Router();

// @ts-ignore
awsRoutes.route("/get-policy").post(auth.required, getPolicy);

export = awsRoutes;

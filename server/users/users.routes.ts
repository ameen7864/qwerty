import { Router } from "express";
import auth from "../middlewares/auth";
import {
  addAddress,
  addUser,
  createUserForOrder,
  getAddresses,
  getData,
  handleGoogleLoginFailed,
  handleGoogleLoginSuccess,
  login,
  logout,
  logoutAll,
  search,
  signupByEmail,
  updateAvatar,
  updatePassword,
  updateProfile,
} from "./users.controller";
import passport from "passport";
import { env } from "../../config/config";

const userRouter = Router();

userRouter.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect:
      env === "production"
        ? "https://napi.manubrothers.com/users/login/failed"
        : "/users/login/failed",
    successRedirect:
      env === "production"
        ? "https://napi.manubrothers.com/users/login/success"
        : "/users/login/success",
    scope: ["profile", "email"],
  })
);

// @ts-ignore
userRouter.route("/login/failed").get(handleGoogleLoginFailed);
// @ts-ignore
userRouter.route("/login/success").get(handleGoogleLoginSuccess);

userRouter
  .route("")
  // @ts-ignore
  .post(auth.required, auth.isAdmin, addUser)
  // @ts-ignore
  .get(auth.required, auth.isAtLeastStaff, search);

// @ts-ignore
userRouter.route("/create-order-user").post(createUserForOrder);

userRouter.route("/signup/email").post(signupByEmail);

// @ts-ignore
userRouter.route("/login").post(login);

// @ts-ignore
userRouter.route("/get/data").get(getData);

// @ts-ignore
userRouter.route("/profile").post(auth.required, updateProfile);

userRouter
  .route("/logout")
  // @ts-ignore
  .get(auth.required, logout)
  // @ts-ignore
  .post(auth.required, logoutAll);

// @ts-ignore
userRouter.route("/update-password").post(auth.required, updatePassword);

userRouter
  .route("/update-avatar")
  // @ts-ignore
  .get(auth.required, auth.withUser, updateAvatar);

userRouter
  .route("/address")
  // @ts-ignore
  .get(auth.required, getAddresses)
  // @ts-ignore
  .post(auth.required, addAddress);

export default userRouter;

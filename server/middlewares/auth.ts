import { NextFunction } from "express";
import UserModel from "../users/models/users.model";
import UserTokenModel from "../users/models/usertoken.model";
import { clearCookies, getTokenFromReq } from "../utils/auth";
import { verifyJWT } from "../utils/jwt";
import { isAdmin as isAdminValidator } from "../utils/auth";
import { isAtleastStaff as isAtLeastStaffValidator } from "../utils/auth";

const required = (req: any, res: any, next: NextFunction) => {
  const token = getTokenFromReq(req);

  if (!token)
    return clearCookies(res).send({ success: false, msg: "Token not found!" });
  else {
    try {
      const verified = verifyJWT(token);
      if (!verified)
        return clearCookies(res).send({
          success: false,
          msg: "Token not verified!",
        });
      // @ts-ignore
      req.payload = verified;
    } catch (err) {
      return clearCookies(res).send({
        success: false,
        msg: "Token not verified!",
      });
    }
  }

  UserTokenModel.findOne({ token, active: true }).then((tok) => {
    if (!tok)
      return clearCookies(res).send({
        sucess: false,
        msg: "Token doesn't exist!",
      });
    else {
      if (!tok.active)
        clearCookies(res).send({
          success: false,
          msg: "Token expired!",
        });
      else if (new Date() > tok.expiresAt) {
        clearCookies(res).send({
          success: false,
          msg: "Token Deactivated!",
        });
      } else {
        next();
      }
    }
  });
};

const optional = (
  req: any,
  res: any,
  next: NextFunction
) => {
  const token = getTokenFromReq(req);
  req.payload = { id: "", role: "" };
  if (!token) next();
  else {
    try {
      const verified = verifyJWT(token);
      if (verified)
        // @ts-ignore
        req.payload = verified;
      next();
    } catch (err) {
      next();
    }
  }
};

const withUser = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const { id } = req.payload;
    const user = await UserModel.findById(id);
    if (!user) res.send({ success: false, msg: "User not found!" });
    else {
      res.locals.user = user;
      next();
    }
  } catch (err) {
    res.send({ success: false, msg: "Error while fetching user!" });
  }
};

const isAdmin = (
  req: any,
  res: any,
  next: NextFunction
) => {
  if (!isAdminValidator(req.payload.role))
    res.send({ success: false, msg: "You are not authorised!" });
  else next();
};

const isAtLeastStaff = (
  req: any,
  res: any,
  next: NextFunction
) => {
  if (!isAtLeastStaffValidator(req.payload.role))
    res.send({ success: false, msg: "You are not authorised!" });
  else next();
};

const auth = { required, withUser, isAdmin, isAtLeastStaff };

export = auth;

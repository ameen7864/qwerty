import { get } from "lodash";
import { getTokenFromReq } from "../utils/auth";
import { verifyJWT } from "../utils/jwt";
import { NextFunction } from "express";

export const isUserExist = (
  req: any,
  res: any,
  next: NextFunction
) => {
  const { user } = req.query;
  if (user) {
    const token = getTokenFromReq(req);
    if (!token)
      res.send({ success: false, msg: "Unattended access, Please login!" });
    else {
      const verified = verifyJWT(token);
      if (verified) {
        if (get(verified, "id") !== user)
          res.send({ success: false, msg: "Unattended access, Please login!" });
        else next();
      } else
        res.send({ success: false, msg: "Unattended access, Please login!" });
    }
  } else {
    next();
  }
};

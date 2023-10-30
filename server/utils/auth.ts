import { get, isArray, isString, lowerCase, split } from "lodash";
import UserTokenModel from "../users/models/usertoken.model";
import { getDomainForCookie } from "./others";

export const USER_ROLES = {
  user: "user",
  staff: "staff",
  admin: "admin",
};

export const rolePriority = [
  USER_ROLES.admin,
  USER_ROLES.staff,
  USER_ROLES.user,
];

export const getTokenFromReq: (
  req: any | any
) => string | null = (req: any | any) => {
  try {
    const { authorization: auth } = req.headers;
    if (
      get(req, "cookies.auth") &&
      get(req, "cookies.auth") !== "null" &&
      get(req, "cookies.auth") !== "undefined"
    )
      return get(req, "cookies.auth");
    if (auth) {
      const splitted = split(auth, " ");
      if (
        lowerCase(splitted[0]) === "token" ||
        lowerCase(splitted[0]) === "bearer"
      )
        if (
          splitted[1] &&
          splitted[1] !== "null" &&
          splitted[1] !== "undefined"
        )
          return splitted[1];
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const clearCookies = (res: any | any) => {
  return res.clearCookie("auth", { domain: getDomainForCookie() });
};

export const clearCookieAndGoBack = (res: any) => {
  clearCookies(res).send({ success: false, msg: "Cookie cleared!" });
};

export const deactivateToken = (token: string) => {
  return new Promise((resolve, reject) => {
    UserTokenModel.findOne({ token })
      .then((tok) => {
        if (tok) {
          tok.active = false;
          tok.save((err) => {
            if (err) reject(err);
            else resolve({ success: true });
          });
        } else {
          resolve({ success: true });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const isSame = (role: string, toCheck: string) => {
  if (toCheck === USER_ROLES.admin) return true;
  return role === toCheck;
};

const isAtLeast = (role: string, toCheck: string) => {
  if (toCheck === USER_ROLES.admin) return true;
  const index = rolePriority.indexOf(role);
  const toCheckIndex = rolePriority.indexOf(toCheck);
  return index >= toCheckIndex;
};

export const isAdmin = (role: string) => isSame(USER_ROLES.admin, role);

export const isAtleastStaff = (role: string) =>
  isAtLeast(USER_ROLES.staff, role);

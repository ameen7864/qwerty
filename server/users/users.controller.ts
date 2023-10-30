import UserModel from "./models/users.model";
import bcrypt, { hashSync } from "bcrypt";
import { generateJWT, verifyJWT } from "../utils/jwt";
import UserTokenModel from "./models/usertoken.model";
import dayjs from "dayjs";
import { generateAvatar } from "../utils/users";
import fs from "fs";
import { clearCookies, deactivateToken, getTokenFromReq } from "../utils/auth";
import { get, random, toNumber, toString } from "lodash";
import logger from "../../config/winston";
import BrandModel from "../admin/models/brand.model";
import CategoryModel from "../admin/models/categories.model";
import ScentModel from "../admin/models/scent.model";
import SubCategoryModel from "../admin/models/subcategories.model";
import ContactUsModel from "./models/contactUs.model";
import DeviceModel from "./models/devices.model";
import NewsletterModel from "./models/newsletter.model";
import { env, googleCallback } from "../../config/config";
import IUser from "./types/users";
import { setCookie } from "../utils/others";
import UserAddressModel from "./models/useraddress.model";

const getAdminData = async (id: string) => {
  const user = await UserModel.findById(id).select(
    "-password -createdAt -updatedAt"
  );
  const brands = await BrandModel.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  const categories = await CategoryModel.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  const scents = await ScentModel.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  const subcategories = await SubCategoryModel.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  return { user, brands, categories, scents, subcategories };
};

const getUserData = async (id: string) => {
  if (id) {
    const user = await UserModel.findById(id).select(
      "-password -createdAt -updatedAt"
    );
    return { user };
  } else return null;
};

const getStaffData = async (id: string) => {
  const user = await UserModel.findById(id).select(
    "-password -createdAt -updatedAt"
  );
  const brands = await BrandModel.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  const categories = await CategoryModel.find({ isArchived: false })
    .populate({ path: "createdBy", select: "displayName role" })
    .sort({ createdAt: -1 });
  const scents = await ScentModel.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  const subcategories = await SubCategoryModel.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .populate({ path: "createdBy", select: "displayName role" });
  return { user, brands, categories, scents, subcategories };
};

export const getData = async (req: any, res: any) => {
  const { portal = "main", reqToken } = req.query;
  try {
    const token = reqToken ? toString(reqToken) : getTokenFromReq(req);
    const payload = verifyJWT(toString(token));
    const role = get(payload, "role", "");
    const id = get(payload, "id", "");
    if (portal === "admin") {
      if (!id || !role)
        return clearCookies(res).send({
          success: false,
          msg: "You are not authorized!",
        });
    }

    if (token) {
      const device = await UserTokenModel.findOne({ token });
      if (!device)
        return res.send({ success: false, msg: "Token is not verified!" });
    }

    let data: any = null;
    let device: string | null = req.body.device || req.query.device;
    // @ts-ignore
    if (role === "admin") data = await getAdminData(id);
    // @ts-ignore
    else if (role === "staff") data = await getStaffData(id);
    else {
      if (
        !device ||
        device === "null" ||
        device === "" ||
        device === "undefined"
      ) {
        const remoteIp = get(req, "socket.remoteAddress");
        const now = dayjs().toString();

        const rand = random(1, 20, false);
        const hash = hashSync(`${remoteIp}${now}`, rand);

        const data: any = { ip: remoteIp, deviceId: hash };

        if (token) {
          const payload = verifyJWT(token);
          const user = get(payload, "id");
          if (user) data.user = user;
        }

        new DeviceModel(data).save(async (err, saved) => {
          if (saved) {
            device = saved._id;
            if (token) {
              const userData = await getUserData(id);
              return res.send({ success: true, data: userData, device });
            } else {
              return res.send({ success: true, device });
            }
          } else {
            return res.send({ success: false });
          }
        });
      } else
        return res.send({ success: true, data: await getUserData(id), device });
    }
    // @ts-ignore
    if (role === "admin" || role === "staff")
      return res.send({ success: true, data, device });
  } catch (err) {
    res.send({ success: false });
  }
};

export const sendOtp = (req: any, res: any) => {
  const { email, mobile } = req.body;
  if (!email || !mobile)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  UserModel.findOne({ $or: [{ email }, { mobile }] })
    .then((user) => {
      if (user) {
        if (user.email === email)
          res.send({ success: false, msg: "Email already Exist!" });
        else res.send({ success: false, msg: "Mobile already Exist!" });
      } else {
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while processing request!" })
    );
};

export const handleGoogleLoginFailed = (req: any, res: any) => {
  redirectErrorLogin(res);
};

export const redirectErrorLogin = (res: any) => {
  clearCookies(res).redirect(`${googleCallback}?status=failed`);
};

export const redirectSuccessLogin = async (
  res: any,
  user: IUser
) => {
  const token = generateJWT({ id: user._id, role: user.role });
  const newToken = new UserTokenModel({
    user: user._id,
    token,
    expiresAt: dayjs().add(2, "month"),
  });
  await newToken.save();
  setCookie(res, "auth", token).redirect(`${googleCallback}?status=success`);
};

export const handleGoogleLoginSuccess = (
  req: any,
  res: any
) => {
  try {
    if (req.user) {
      // @ts-ignore
      const {
        // @ts-ignore
        emails,
        // @ts-ignore
        name: { givenName, familyName },
        // @ts-ignore
        picture,
        // @ts-ignore
        gender,
      } = req.user;

      const email = get(emails, "[0].value");
      const emailVerified = get(emails, "[0].verified");

      if (!email) return redirectErrorLogin(res);

      UserModel.findOne({ email })
        .then((u) => {
          if (!u) {
            const user = new UserModel({
              email,
              gender,
              firstName: givenName,
              lastName: familyName,
              dp: picture,
              emailVerified: emailVerified,
              signupType: "google",
              verifiedBy: "google",
              role: "user",
            });
            user.addedBy = user._id;
            user.save(async (err) => {
              if (err) {
                logger.error({ err, message: "User saving error!" });
                redirectErrorLogin(res);
              } else await redirectSuccessLogin(res, user);
            });
          } else {
            u.emailVerified = emailVerified;
            u.firstName = givenName;
            u.lastName = familyName;
            u.save(async (err) => {
              if (err) {
                logger.error({ err, message: "User updating error!" });
                redirectErrorLogin(res);
              } else await redirectSuccessLogin(res, u);
            });
          }
        })
        .catch((err) => {
          logger.error({ err, message: "Error on fetching user!" });
          redirectErrorLogin(res);
        });
    } else {
      logger.error({ message: "User not returned in google auth!" });
      redirectErrorLogin(res);
    }
  } catch (err) {
    logger.error({ message: "Error on success login", err });
    redirectErrorLogin(res);
  }
};

export const createUserForOrder = (
  req: any,
  res: any
) => {
  const { email, mobile } = req.body;

  if (!email && !mobile)
    return res.send({
      success: false,
      msg: "Either email or mobile required!",
    });

  UserModel.findOne({ $or: [{ email }, { mobile }] })
    .then(async (u) => {
      if (u) {
        const token = generateJWT({ id: u._id, role: u.role });
        const newToken = new UserTokenModel({
          user: u._id,
          token,
          expiresAt: dayjs().add(2, "month"),
        });
        await newToken.save();
        setCookie(res, "auth", token);
        req.payload = { id: u._id, role: "user" };
        req.query.reqToken = token;
        getData(req, res);
      } else {
        const user = new UserModel({
          email,
          mobile,
          verifiedBy: email ? "email" : "otp",
          signupType: email ? "email" : "mobile",
          emailVerified: email ? true : false,
          mobileVerified: mobile ? true : false,
        });
        user.addedBy = user._id;
        user.save(async (err, saved) => {
          console.log(err);
          if (err) res.send({ success: false, msg: "Account not created!" });
          else {
            const token = generateJWT({ id: user._id, role: user.role });
            const newToken = new UserTokenModel({
              user: user._id,
              token,
              expiresAt: dayjs().add(2, "month"),
            });
            await newToken.save();
            setCookie(res, "auth", token);
            req.payload = { id: saved._id, role: "user" };
            req.query.reqToken = token;
            getData(req, res);
          }
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while processing request!" });
    });
};

export const addUser = (req: any, res: any) => {
  const { id } = req.payload;
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    username,
    gender,
    role,
    countryCode,
  } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password || !gender)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  UserModel.findOne({ $or: [{ email }, { mobile }, { username }] })
    .then((user) => {
      if (user) {
        if (user.email === email)
          return res.send({ success: false, msg: "Email exist!" });
        if (user.username === username)
          return res.send({ success: false, msg: "Username exist!" });
        if (user.mobile === toNumber(mobile))
          return res.send({ success: false, msg: "Mobile exist!" });
      } else {
        const info: any = {
          firstName,
          lastName,
          email,
          mobile,
          password: hashSync(password, 10),
          username,
          gender,
          role,
          addedBy: id,
          emailVerified: true,
          mobileVerified: true,
        };
        if (!role) info.role = "user";
        if (!countryCode) info.countryCode = 91;
        new UserModel(info).save((err) => {
          if (err)
            res.send({ success: false, msg: "Error while adding user!" });
          else res.send({ success: true, msg: "User Saved!" });
        });
      }
    })
    .catch((err) => {
      logger.error({
        message: "Error checking existing on Admin Panel /users/add-user",
        body: req.body,
        err: err.message,
      });
      res.send({ success: false, msg: "Error while cheking existing user!" });
    });
};

export const search = (req: any, res: any) => {
  const { keywords, role, limit, skip } = req.query;

  let qKeywords =
    keywords && keywords !== "null" && keywords !== ""
      ? toString(keywords)
      : null;
  let qRole = role && role !== "null" && role !== "" ? toString(role) : null;
  let qSkip = skip && skip !== "null" && skip !== "" ? toNumber(skip) : 0;
  let qLimit = limit && limit !== "null" && limit !== "" ? toNumber(limit) : 50;

  const query: any = {};
  if (qKeywords) {
    const regex = { $regex: keywords, $options: "i" };
    query.$or = [];
    query.$or.push({ email: regex });
    query.$or.push({ username: regex });
    query.$or.push({ mobile: regex });
    query.$or.push({ firstName: regex });
    query.$or.push({ lastName: regex });
  }
  if (qRole) query.role = qRole;

  UserModel.find(query)
    .select("-password")
    .skip(qSkip)
    .limit(qLimit)
    .then(async (users) => {
      const total = await UserModel.find(query).countDocuments();
      res.send({ success: true, users, total });
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false, msg: "Error while fetching data!" });
    });
};

export const signupByEmail = async (req: any, res: any) => {
  const { email, password, firstName, lastName, gender, mobile, device } =
    req.body;
  if (!email || !password || !firstName)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  const user = await UserModel.findOne({ email, mobile });

  if (user) {
    if (user.email === email)
      return res.send({ success: false, msg: "Email already exist!" });
    else return res.send({ success: false, msg: "Mobile already exist!" });
  }
  const newPassword = bcrypt.hashSync(password, 10);
  const newUser = new UserModel({
    email,
    password: newPassword,
    firstName,
    lastName,
    gender,
    mobile,
  });

  newUser.save((err, saved) => {
    if (err) res.send({ success: false, msg: "Error while registering..." });
    else {
      const token = generateJWT({ id: saved._id, role: "user" });
      new UserTokenModel({
        user: saved._id,
        token,
        expiresAt: dayjs().add(2, "month"),
      }).save(async (err) => {
        await DeviceModel.updateOne(
          { _id: device },
          { $set: { user: saved._id } }
        );
        if (err)
          res.send({
            success: false,
            msg: "Error while login, please login again",
          });
        else
          setCookie(res, "auth", token).send({
            success: true,
            msg: "Successfully registered...",
            token,
          });
      });
    }
  });
};

export const login = (req: any, res: any) => {
  const { email, password, device } = req.body;
  if (!email || !password)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  UserModel.findOne({ email })
    .then(async (user) => {
      if (!user) res.send({ success: false, msg: "Email not found!" });
      else {
        if (await user.verifyPassword(password)) {
          const token = generateJWT({ id: user._id, role: user.role });
          const newToken = new UserTokenModel({
            user: user._id,
            token,
            expiresAt: dayjs().add(2, "month"),
          });
          await newToken.save();
          await DeviceModel.updateOne(
            { _id: device },
            { $set: { user: user._id } }
          );
          setCookie(res, "auth", token).send({ success: true, token, user });
        } else res.send({ success: false, msg: "Password doesn't match!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false, msg: "Error while processing data!" });
    });
};

export const updateAvatar = async (
  req: any,
  res: any
) => {
  const { user } = res.locals;
  const { hostname: host } = req;
  const filePath = `public/${user._id}.svg`;
  const data = await generateAvatar("female");
  fs.writeFile(filePath, data, (err) => {
    if (err) res.send({ success: false, msg: "Avatar not saved" });
    else
      res.send({
        success: true,
        msg: "Avatar saved!",
        path: `http://${host}/${filePath}`,
      });
  });
};

export const updateProfile = async (
  req: any,
  res: any
) => {
  const { id } = req.payload;
  const { firstName, lastName, gender, email, mobile, username } = req.body;

  if (username) {
    const user = await UserModel.findOne({ username });
    if (user) {
      if (toString(user._id) !== id)
        return res.send({ success: false, msg: "Username already in use!" });
    }
  }

  if (email) {
    const user = await UserModel.findOne({ email });
    if (user) {
      if (toString(user._id) !== id)
        return res.send({ success: false, msg: "Email already in use!" });
    }
  }

  if (mobile) {
    const user = await UserModel.findOne({ mobile });
    if (user) {
      if (toString(user._id) !== id)
        return res.send({ success: false, msg: "Mobile already in use!" });
    }
  }

  UserModel.findById(id)
    .then((user) => {
      if (!user) res.send({ success: false, msg: "User not found!" });
      else {
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (gender !== undefined) user.gender = gender;
        if (email !== undefined) user.email = email;
        if (mobile !== undefined) user.mobile = mobile;
        if (username !== undefined) user.username = username;
        if (gender !== undefined) user.gender = gender;

        console.log(user);

        user.save((err) => {
          if (err)
            res.send({ success: false, msg: "Error while updating user!" });
          else getData(req, res);
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while getting user!" });
    });
};

export const logout = (req: any, res: any) => {
  const token = getTokenFromReq(req);
  if (!token) res.send({ success: false, msg: "Token not found in request" });
  else {
    deactivateToken(token)
      .then((done) => {
        clearCookies(res).send({
          success: true,
          msg: "Logged out successfully!",
        });
      })
      .catch((err) => {
        res.send({ success: false, msg: "Error while Logging out..." });
      });
  }
};

export const logoutAll = (req: any, res: any) => {
  const { id } = req.payload;
  UserTokenModel.updateMany({ user: id }, { $set: { active: false } })
    .then((updated) => {
      res.send({ success: true, msg: "All session has deactivated!" });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Unable to logout from all sessions!" });
    });
};

export const updatePassword = (req: any, res: any) => {
  const { id } = req.payload;
  const { oldPassword, newPassword } = req.body;
  console.log(req.body);
  UserModel.findById(id)
    .then(async (user) => {
      if (!user) {
        res.send({ success: false, msg: "User not found!" });
      } else {
        if (await user.verifyPassword(oldPassword)) {
          user.password = bcrypt.hashSync(newPassword, 10);
          user.save((err) => {
            if (err)
              res.send({
                err: err.message,
                success: false,
                msg: "Error while updating password",
              });
            else res.send({ success: true, msg: "Password changed!" });
          });
        } else res.send({ success: false, msg: "Old Password doesn't match!" });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while fetching user!" })
    );
};

export const generateDeviceId = (req: any, res: any) => {
  const { deviceId } = req.body;
  const token = getTokenFromReq(req);
  if (deviceId && deviceId !== "null" && deviceId !== "undefined")
    return res.send({ success: true, deviceId });

  const remoteIp = get(req, "socket.remoteAddress");
  const now = dayjs().toString();

  const rand = random(1, 20, false);
  const hash = hashSync(`${remoteIp}${now}`, rand);

  const data: any = { ip: remoteIp, deviceId: hash };

  if (token) {
    const payload = verifyJWT(token);
    const user = get(payload, "id");
    if (user) data.user = user;
  }

  new DeviceModel(data).save((err, saved) => {
    if (err) res.send({ success: false, msg: "Error while saving device!" });
    else res.send({ success: true, deviceId: saved._id });
  });
};

export const addContactUs = (req: any, res: any) => {
  const { name, email, mobile, enquireFor, description, user } = req.body;

  new ContactUsModel({
    name,
    email,
    mobile,
    enquireFor,
    description,
    user,
  }).save((err) => {
    if (err) res.send({ success: false, msg: "Error while saving details!" });
    else res.send({ success: true, msg: "Details saved!" });
  });
};

export const subscribeNewsletter = (
  req: any,
  res: any
) => {
  const { email, device } = req.body;

  if (!email) return res.send({ success: false, msg: "Email is required!" });

  new NewsletterModel({ email, device }).save((err) => {
    if (err) res.send({ success: false, msg: "Error while subscribing!" });
    else res.send({ success: true, msg: "Subscribed to newsletter!" });
  });
};

export const unsubscribeToNewsletter = (
  req: any,
  res: any
) => {
  const { email } = req.query;

  if (!email)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  NewsletterModel.findOne({ email, isArchived: false })
    .then((nl) => {
      if (!nl)
        res.send({ success: false, msg: "You are already unsubscribed" });
      else {
        nl.isArchived = true;
        nl.save((err) => {
          if (err)
            res.send({
              success: false,
              msg: "Error while removing subscription!",
            });
          else res.send({ success: true, msg: "Successfully unsubscribed!" });
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while finding subscription!" });
    });
};

export const addAddress = async (req: any, res: any) => {
  const { id } = req.payload;
  const { name, line1, line2, area, city, state, pincode } = req.body;
  let { type = "order" } = req.body;

  if (!name || !line1 || !area || !city || !state || !pincode)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  const count = await UserAddressModel.findOne({
    isArchived: false,
    type: "billing",
  }).countDocuments();

  if (count === 0) type = "billing";

  new UserAddressModel({
    name,
    line1,
    line2,
    area,
    city,
    state,
    pincode,
    type,
    user: id,
  }).save((err) => {
    if (err) res.send({ success: false, msg: "Error while adding address" });
    else res.send({ success: true, msg: "Address saved!" });
  });
};

export const getAddresses = async (
  req: any,
  res: any
) => {
  const { id } = req.payload;

  UserAddressModel.find({ user: id })
    .then((addresses) => {
      res.send({ success: true, addresses });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while loading addresses!" });
    });
};

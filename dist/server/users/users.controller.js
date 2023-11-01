"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddresses = exports.addAddress = exports.unsubscribeToNewsletter = exports.subscribeNewsletter = exports.addContactUs = exports.generateDeviceId = exports.updatePassword = exports.logoutAll = exports.logout = exports.updateProfile = exports.updateAvatar = exports.login = exports.signupByEmail = exports.search = exports.addUser = exports.createUserForOrder = exports.handleGoogleLoginSuccess = exports.redirectSuccessLogin = exports.redirectErrorLogin = exports.handleGoogleLoginFailed = exports.sendOtp = exports.getData = void 0;
const users_model_1 = __importDefault(require("./models/users.model"));
const bcrypt_1 = __importStar(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const usertoken_model_1 = __importDefault(require("./models/usertoken.model"));
const dayjs_1 = __importDefault(require("dayjs"));
const users_1 = require("../utils/users");
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../utils/auth");
const lodash_1 = require("lodash");
const winston_1 = __importDefault(require("../../config/winston"));
const brand_model_1 = __importDefault(require("../admin/models/brand.model"));
const categories_model_1 = __importDefault(require("../admin/models/categories.model"));
const scent_model_1 = __importDefault(require("../admin/models/scent.model"));
const subcategories_model_1 = __importDefault(require("../admin/models/subcategories.model"));
const contactUs_model_1 = __importDefault(require("./models/contactUs.model"));
const devices_model_1 = __importDefault(require("./models/devices.model"));
const newsletter_model_1 = __importDefault(require("./models/newsletter.model"));
const config_1 = require("../../config/config");
const others_1 = require("../utils/others");
const useraddress_model_1 = __importDefault(require("./models/useraddress.model"));
const getAdminData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_model_1.default.findById(id).select("-password -createdAt -updatedAt");
    const brands = yield brand_model_1.default.find({})
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    const categories = yield categories_model_1.default.find({})
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    const scents = yield scent_model_1.default.find({})
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    const subcategories = yield subcategories_model_1.default.find({})
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    return { user, brands, categories, scents, subcategories };
});
const getUserData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        const user = yield users_model_1.default.findById(id).select("-password -createdAt -updatedAt");
        return { user };
    }
    else
        return null;
});
const getStaffData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_model_1.default.findById(id).select("-password -createdAt -updatedAt");
    const brands = yield brand_model_1.default.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    const categories = yield categories_model_1.default.find({ isArchived: false })
        .populate({ path: "createdBy", select: "displayName role" })
        .sort({ createdAt: -1 });
    const scents = yield scent_model_1.default.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    const subcategories = yield subcategories_model_1.default.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "displayName role" });
    return { user, brands, categories, scents, subcategories };
});
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portal = "main", reqToken } = req.query;
    try {
        const token = reqToken ? (0, lodash_1.toString)(reqToken) : (0, auth_1.getTokenFromReq)(req);
        const payload = (0, jwt_1.verifyJWT)((0, lodash_1.toString)(token));
        const role = (0, lodash_1.get)(payload, "role", "");
        const id = (0, lodash_1.get)(payload, "id", "");
        if (portal === "admin") {
            if (!id || !role)
                return (0, auth_1.clearCookies)(res).send({
                    success: false,
                    msg: "You are not authorized!",
                });
        }
        if (token) {
            const device = yield usertoken_model_1.default.findOne({ token });
            if (!device)
                return res.send({ success: false, msg: "Token is not verified!" });
        }
        let data = null;
        let device = req.body.device || req.query.device;
        // @ts-ignore
        if (role === "admin")
            data = yield getAdminData(id);
        // @ts-ignore
        else if (role === "staff")
            data = yield getStaffData(id);
        else {
            if (!device ||
                device === "null" ||
                device === "" ||
                device === "undefined") {
                const remoteIp = (0, lodash_1.get)(req, "socket.remoteAddress");
                const now = (0, dayjs_1.default)().toString();
                const rand = (0, lodash_1.random)(1, 20, false);
                const hash = (0, bcrypt_1.hashSync)(`${remoteIp}${now}`, rand);
                const data = { ip: remoteIp, deviceId: hash };
                if (token) {
                    const payload = (0, jwt_1.verifyJWT)(token);
                    const user = (0, lodash_1.get)(payload, "id");
                    if (user)
                        data.user = user;
                }
                new devices_model_1.default(data).save((err, saved) => __awaiter(void 0, void 0, void 0, function* () {
                    if (saved) {
                        device = saved._id;
                        if (token) {
                            const userData = yield getUserData(id);
                            return res.send({ success: true, data: userData, device });
                        }
                        else {
                            return res.send({ success: true, device });
                        }
                    }
                    else {
                        return res.send({ success: false });
                    }
                }));
            }
            else
                return res.send({ success: true, data: yield getUserData(id), device });
        }
        // @ts-ignore
        if (role === "admin" || role === "staff")
            return res.send({ success: true, data, device });
    }
    catch (err) {
        res.send({ success: false });
    }
});
exports.getData = getData;
const sendOtp = (req, res) => {
    const { email, mobile } = req.body;
    if (!email || !mobile)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    users_model_1.default.findOne({ $or: [{ email }, { mobile }] })
        .then((user) => {
        if (user) {
            if (user.email === email)
                res.send({ success: false, msg: "Email already Exist!" });
            else
                res.send({ success: false, msg: "Mobile already Exist!" });
        }
        else {
        }
    })
        .catch((err) => res.send({ success: false, msg: "Error while processing request!" }));
};
exports.sendOtp = sendOtp;
const handleGoogleLoginFailed = (req, res) => {
    (0, exports.redirectErrorLogin)(res);
};
exports.handleGoogleLoginFailed = handleGoogleLoginFailed;
const redirectErrorLogin = (res) => {
    (0, auth_1.clearCookies)(res).redirect(`${config_1.googleCallback}?status=failed`);
};
exports.redirectErrorLogin = redirectErrorLogin;
const redirectSuccessLogin = (res, user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, jwt_1.generateJWT)({ id: user._id, role: user.role });
    const newToken = new usertoken_model_1.default({
        user: user._id,
        token,
        expiresAt: (0, dayjs_1.default)().add(2, "month"),
    });
    yield newToken.save();
    (0, others_1.setCookie)(res, "auth", token).redirect(`${config_1.googleCallback}?status=success`);
});
exports.redirectSuccessLogin = redirectSuccessLogin;
const handleGoogleLoginSuccess = (req, res) => {
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
            gender, } = req.user;
            const email = (0, lodash_1.get)(emails, "[0].value");
            const emailVerified = (0, lodash_1.get)(emails, "[0].verified");
            if (!email)
                return (0, exports.redirectErrorLogin)(res);
            users_model_1.default.findOne({ email })
                .then((u) => {
                if (!u) {
                    const user = new users_model_1.default({
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
                    user.save((err) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            winston_1.default.error({ err, message: "User saving error!" });
                            (0, exports.redirectErrorLogin)(res);
                        }
                        else
                            yield (0, exports.redirectSuccessLogin)(res, user);
                    }));
                }
                else {
                    u.emailVerified = emailVerified;
                    u.firstName = givenName;
                    u.lastName = familyName;
                    u.save((err) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            winston_1.default.error({ err, message: "User updating error!" });
                            (0, exports.redirectErrorLogin)(res);
                        }
                        else
                            yield (0, exports.redirectSuccessLogin)(res, u);
                    }));
                }
            })
                .catch((err) => {
                winston_1.default.error({ err, message: "Error on fetching user!" });
                (0, exports.redirectErrorLogin)(res);
            });
        }
        else {
            winston_1.default.error({ message: "User not returned in google auth!" });
            (0, exports.redirectErrorLogin)(res);
        }
    }
    catch (err) {
        winston_1.default.error({ message: "Error on success login", err });
        (0, exports.redirectErrorLogin)(res);
    }
};
exports.handleGoogleLoginSuccess = handleGoogleLoginSuccess;
const createUserForOrder = (req, res) => {
    const { email, mobile } = req.body;
    if (!email && !mobile)
        return res.send({
            success: false,
            msg: "Either email or mobile required!",
        });
    users_model_1.default.findOne({ $or: [{ email }, { mobile }] })
        .then((u) => __awaiter(void 0, void 0, void 0, function* () {
        if (u) {
            const token = (0, jwt_1.generateJWT)({ id: u._id, role: u.role });
            const newToken = new usertoken_model_1.default({
                user: u._id,
                token,
                expiresAt: (0, dayjs_1.default)().add(2, "month"),
            });
            yield newToken.save();
            (0, others_1.setCookie)(res, "auth", token);
            req.payload = { id: u._id, role: "user" };
            req.query.reqToken = token;
            (0, exports.getData)(req, res);
        }
        else {
            const user = new users_model_1.default({
                email,
                mobile,
                verifiedBy: email ? "email" : "otp",
                signupType: email ? "email" : "mobile",
                emailVerified: email ? true : false,
                mobileVerified: mobile ? true : false,
            });
            user.addedBy = user._id;
            user.save((err, saved) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(err);
                if (err)
                    res.send({ success: false, msg: "Account not created!" });
                else {
                    const token = (0, jwt_1.generateJWT)({ id: user._id, role: user.role });
                    const newToken = new usertoken_model_1.default({
                        user: user._id,
                        token,
                        expiresAt: (0, dayjs_1.default)().add(2, "month"),
                    });
                    yield newToken.save();
                    (0, others_1.setCookie)(res, "auth", token);
                    req.payload = { id: saved._id, role: "user" };
                    req.query.reqToken = token;
                    (0, exports.getData)(req, res);
                }
            }));
        }
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while processing request!" });
    });
};
exports.createUserForOrder = createUserForOrder;
const addUser = (req, res) => {
    const { id } = req.payload;
    const { firstName, lastName, email, mobile, password, username, gender, role, countryCode, } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password || !gender)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    users_model_1.default.findOne({ $or: [{ email }, { mobile }, { username }] })
        .then((user) => {
        if (user) {
            if (user.email === email)
                return res.send({ success: false, msg: "Email exist!" });
            if (user.username === username)
                return res.send({ success: false, msg: "Username exist!" });
            if (user.mobile === (0, lodash_1.toNumber)(mobile))
                return res.send({ success: false, msg: "Mobile exist!" });
        }
        else {
            const info = {
                firstName,
                lastName,
                email,
                mobile,
                password: (0, bcrypt_1.hashSync)(password, 10),
                username,
                gender,
                role,
                addedBy: id,
                emailVerified: true,
                mobileVerified: true,
            };
            if (!role)
                info.role = "user";
            if (!countryCode)
                info.countryCode = 91;
            new users_model_1.default(info).save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while adding user!" });
                else
                    res.send({ success: true, msg: "User Saved!" });
            });
        }
    })
        .catch((err) => {
        winston_1.default.error({
            message: "Error checking existing on Admin Panel /users/add-user",
            body: req.body,
            err: err.message,
        });
        res.send({ success: false, msg: "Error while cheking existing user!" });
    });
};
exports.addUser = addUser;
const search = (req, res) => {
    const { keywords, role, limit, skip } = req.query;
    let qKeywords = keywords && keywords !== "null" && keywords !== ""
        ? (0, lodash_1.toString)(keywords)
        : null;
    let qRole = role && role !== "null" && role !== "" ? (0, lodash_1.toString)(role) : null;
    let qSkip = skip && skip !== "null" && skip !== "" ? (0, lodash_1.toNumber)(skip) : 0;
    let qLimit = limit && limit !== "null" && limit !== "" ? (0, lodash_1.toNumber)(limit) : 50;
    const query = {};
    if (qKeywords) {
        const regex = { $regex: keywords, $options: "i" };
        query.$or = [];
        query.$or.push({ email: regex });
        query.$or.push({ username: regex });
        query.$or.push({ mobile: regex });
        query.$or.push({ firstName: regex });
        query.$or.push({ lastName: regex });
    }
    if (qRole)
        query.role = qRole;
    users_model_1.default.find(query)
        .select("-password")
        .skip(qSkip)
        .limit(qLimit)
        .then((users) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield users_model_1.default.find(query).countDocuments();
        res.send({ success: true, users, total });
    }))
        .catch((err) => {
        console.log(err);
        res.send({ success: false, msg: "Error while fetching data!" });
    });
};
exports.search = search;
const signupByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, gender, mobile, device } = req.body;
    if (!email || !password || !firstName)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    const user = yield users_model_1.default.findOne({ email, mobile });
    if (user) {
        if (user.email === email)
            return res.send({ success: false, msg: "Email already exist!" });
        else
            return res.send({ success: false, msg: "Mobile already exist!" });
    }
    const newPassword = bcrypt_1.default.hashSync(password, 10);
    const newUser = new users_model_1.default({
        email,
        password: newPassword,
        firstName,
        lastName,
        gender,
        mobile,
    });
    newUser.save((err, saved) => {
        if (err)
            res.send({ success: false, msg: "Error while registering..." });
        else {
            const token = (0, jwt_1.generateJWT)({ id: saved._id, role: "user" });
            new usertoken_model_1.default({
                user: saved._id,
                token,
                expiresAt: (0, dayjs_1.default)().add(2, "month"),
            }).save((err) => __awaiter(void 0, void 0, void 0, function* () {
                yield devices_model_1.default.updateOne({ _id: device }, { $set: { user: saved._id } });
                if (err)
                    res.send({
                        success: false,
                        msg: "Error while login, please login again",
                    });
                else
                    (0, others_1.setCookie)(res, "auth", token).send({
                        success: true,
                        msg: "Successfully registered...",
                        token,
                    });
            }));
        }
    });
});
exports.signupByEmail = signupByEmail;
const login = (req, res) => {
    const { email, password, device } = req.body;
    if (!email || !password)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    users_model_1.default.findOne({ email })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user)
            res.send({ success: false, msg: "Email not found!" });
        else {
            if (yield user.verifyPassword(password)) {
                const token = (0, jwt_1.generateJWT)({ id: user._id, role: user.role });
                const newToken = new usertoken_model_1.default({
                    user: user._id,
                    token,
                    expiresAt: (0, dayjs_1.default)().add(2, "month"),
                });
                yield newToken.save();
                yield devices_model_1.default.updateOne({ _id: device }, { $set: { user: user._id } });
                (0, others_1.setCookie)(res, "auth", token).send({ success: true, token, user });
            }
            else
                res.send({ success: false, msg: "Password doesn't match!" });
        }
    }))
        .catch((err) => {
        console.log(err);
        res.send({ success: false, msg: "Error while processing data!" });
    });
};
exports.login = login;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { hostname: host } = req;
    const filePath = `public/${user._id}.svg`;
    const data = yield (0, users_1.generateAvatar)("female");
    fs_1.default.writeFile(filePath, data, (err) => {
        if (err)
            res.send({ success: false, msg: "Avatar not saved" });
        else
            res.send({
                success: true,
                msg: "Avatar saved!",
                path: `http://${host}/${filePath}`,
            });
    });
});
exports.updateAvatar = updateAvatar;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    const { firstName, lastName, gender, email, mobile, username } = req.body;
    if (username) {
        const user = yield users_model_1.default.findOne({ username });
        if (user) {
            if ((0, lodash_1.toString)(user._id) !== id)
                return res.send({ success: false, msg: "Username already in use!" });
        }
    }
    if (email) {
        const user = yield users_model_1.default.findOne({ email });
        if (user) {
            if ((0, lodash_1.toString)(user._id) !== id)
                return res.send({ success: false, msg: "Email already in use!" });
        }
    }
    if (mobile) {
        const user = yield users_model_1.default.findOne({ mobile });
        if (user) {
            if ((0, lodash_1.toString)(user._id) !== id)
                return res.send({ success: false, msg: "Mobile already in use!" });
        }
    }
    users_model_1.default.findById(id)
        .then((user) => {
        if (!user)
            res.send({ success: false, msg: "User not found!" });
        else {
            if (firstName !== undefined)
                user.firstName = firstName;
            if (lastName !== undefined)
                user.lastName = lastName;
            if (gender !== undefined)
                user.gender = gender;
            if (email !== undefined)
                user.email = email;
            if (mobile !== undefined)
                user.mobile = mobile;
            if (username !== undefined)
                user.username = username;
            if (gender !== undefined)
                user.gender = gender;
            console.log(user);
            user.save((err) => {
                if (err)
                    res.send({ success: false, msg: "Error while updating user!" });
                else
                    (0, exports.getData)(req, res);
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while getting user!" });
    });
});
exports.updateProfile = updateProfile;
const logout = (req, res) => {
    const token = (0, auth_1.getTokenFromReq)(req);
    if (!token)
        res.send({ success: false, msg: "Token not found in request" });
    else {
        (0, auth_1.deactivateToken)(token)
            .then((done) => {
            (0, auth_1.clearCookies)(res).send({
                success: true,
                msg: "Logged out successfully!",
            });
        })
            .catch((err) => {
            res.send({ success: false, msg: "Error while Logging out..." });
        });
    }
};
exports.logout = logout;
const logoutAll = (req, res) => {
    const { id } = req.payload;
    usertoken_model_1.default.updateMany({ user: id }, { $set: { active: false } })
        .then((updated) => {
        res.send({ success: true, msg: "All session has deactivated!" });
    })
        .catch((err) => {
        res.send({ success: false, msg: "Unable to logout from all sessions!" });
    });
};
exports.logoutAll = logoutAll;
const updatePassword = (req, res) => {
    const { id } = req.payload;
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    users_model_1.default.findById(id)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            res.send({ success: false, msg: "User not found!" });
        }
        else {
            if (yield user.verifyPassword(oldPassword)) {
                user.password = bcrypt_1.default.hashSync(newPassword, 10);
                user.save((err) => {
                    if (err)
                        res.send({
                            err: err.message,
                            success: false,
                            msg: "Error while updating password",
                        });
                    else
                        res.send({ success: true, msg: "Password changed!" });
                });
            }
            else
                res.send({ success: false, msg: "Old Password doesn't match!" });
        }
    }))
        .catch((err) => res.send({ success: false, msg: "Error while fetching user!" }));
};
exports.updatePassword = updatePassword;
const generateDeviceId = (req, res) => {
    const { deviceId } = req.body;
    const token = (0, auth_1.getTokenFromReq)(req);
    if (deviceId && deviceId !== "null" && deviceId !== "undefined")
        return res.send({ success: true, deviceId });
    const remoteIp = (0, lodash_1.get)(req, "socket.remoteAddress");
    const now = (0, dayjs_1.default)().toString();
    const rand = (0, lodash_1.random)(1, 20, false);
    const hash = (0, bcrypt_1.hashSync)(`${remoteIp}${now}`, rand);
    const data = { ip: remoteIp, deviceId: hash };
    if (token) {
        const payload = (0, jwt_1.verifyJWT)(token);
        const user = (0, lodash_1.get)(payload, "id");
        if (user)
            data.user = user;
    }
    new devices_model_1.default(data).save((err, saved) => {
        if (err)
            res.send({ success: false, msg: "Error while saving device!" });
        else
            res.send({ success: true, deviceId: saved._id });
    });
};
exports.generateDeviceId = generateDeviceId;
const addContactUs = (req, res) => {
    const { name, email, mobile, enquireFor, description, user } = req.body;
    new contactUs_model_1.default({
        name,
        email,
        mobile,
        enquireFor,
        description,
        user,
    }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Error while saving details!" });
        else
            res.send({ success: true, msg: "Details saved!" });
    });
};
exports.addContactUs = addContactUs;
const subscribeNewsletter = (req, res) => {
    const { email, device } = req.body;
    if (!email)
        return res.send({ success: false, msg: "Email is required!" });
    new newsletter_model_1.default({ email, device }).save((err) => {
        if (err)
            res.send({ success: false, msg: "Error while subscribing!" });
        else
            res.send({ success: true, msg: "Subscribed to newsletter!" });
    });
};
exports.subscribeNewsletter = subscribeNewsletter;
const unsubscribeToNewsletter = (req, res) => {
    const { email } = req.query;
    if (!email)
        return res.send({ success: false, msg: "Please send valid parameters!" });
    newsletter_model_1.default.findOne({ email, isArchived: false })
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
                else
                    res.send({ success: true, msg: "Successfully unsubscribed!" });
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while finding subscription!" });
    });
};
exports.unsubscribeToNewsletter = unsubscribeToNewsletter;
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    const { name, line1, line2, area, city, state, pincode } = req.body;
    let { type = "order" } = req.body;
    if (!name || !line1 || !area || !city || !state || !pincode)
        return res.send({ success: false, msg: "Please send proper parameters!" });
    const count = yield useraddress_model_1.default.findOne({
        isArchived: false,
        type: "billing",
    }).countDocuments();
    if (count === 0)
        type = "billing";
    new useraddress_model_1.default({
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
        if (err)
            res.send({ success: false, msg: "Error while adding address" });
        else
            res.send({ success: true, msg: "Address saved!" });
    });
});
exports.addAddress = addAddress;
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    useraddress_model_1.default.find({ user: id })
        .then((addresses) => {
        res.send({ success: true, addresses });
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while loading addresses!" });
    });
});
exports.getAddresses = getAddresses;

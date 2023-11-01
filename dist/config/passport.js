"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const config_1 = require("./config");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.googleClientId,
    clientSecret: config_1.googleClientSecret,
    callbackURL: "/users/google/callback",
    scope: ["profile", "email"],
    proxy: true,
}, (accessToken, refreshToken, profile, callback) => {
    if (!profile) {
        callback("Profile not found!", undefined);
    }
    else {
        callback(null, profile);
    }
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    // @ts-ignore
    done(null, user);
});
module.exports = passport_1.default;

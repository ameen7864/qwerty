import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { googleClientId, googleClientSecret, sessionSecret } from "./config";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/users/google/callback",
      scope: ["profile", "email"],
      proxy: true,
    },
    (accessToken, refreshToken, profile, callback) => {
      if (!profile) {
        callback("Profile not found!", undefined);
      } else {
        callback(null, profile);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // @ts-ignore
  done(null, user);
});

export = passport;

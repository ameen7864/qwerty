import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {
  allowedDomains,
  apiBase,
  mongoUrl,
  sessionSecret,
  sessionUrl,
} from "./config";
import logger from "./winston";
import appRouter from "../index.routes";
import cors from "cors";
import useragent from "express-useragent";
import passport from "../config/passport";
// import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: allowedDomains,
    credentials: true,
  })
);

app.use(useragent.express());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: sessionSecret,
    store: MongoStore.create({ mongoUrl: sessionUrl }),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", true);
mongoose.connect(mongoUrl, (err) => {
  if (err)
    logger.error({
      message: `Error while connecting mongo: ${mongoUrl}`,
      err: err,
      errMessage: err.message,
    });
  else logger.info({ message: `Mongo connected to ${mongoUrl}` });
});

app.use((req, res, next) => {
  // console.log({
  //   headers: req.headers,
  //   body: req.body,
  //   query: req.query,
  //   method: req.method,
  //   originalUrl: req.originalUrl,
  //   httpVersion: req.httpVersion,
  //   url: req.url,
  //   res: { statusCode: res.statusCode },
  // });
  logger.info({
    headers: req.headers,
    body: req.body,
    query: req.query,
    method: req.method,
    originalUrl: req.originalUrl,
    httpVersion: req.httpVersion,
    url: req.url,
    res: { statusCode: res.statusCode },
  });
  next();
});

app.use(apiBase, appRouter);

app.use((req, res) => {
  logger.error({ success: false, msg: `404 - Not Found; url: ${req.url}` });
  res.send({ success: false, msg: "404 - Not Found" });
});

export = app;

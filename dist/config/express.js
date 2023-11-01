"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const winston_1 = __importDefault(require("./winston"));
const index_routes_1 = __importDefault(require("../index.routes"));
const cors_1 = __importDefault(require("cors"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const passport_1 = __importDefault(require("../config/passport"));
// import passport from "passport";
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: config_1.allowedDomains,
    credentials: true,
}));
app.use(express_useragent_1.default.express());
app.use(body_parser_1.default.text());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: config_1.sessionSecret,
    store: connect_mongo_1.default.create({ mongoUrl: config_1.sessionUrl }),
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
mongoose_1.default.set("strictQuery", true);
mongoose_1.default.connect(config_1.mongoUrl, (err) => {
    if (err)
        winston_1.default.error({
            message: `Error while connecting mongo: ${config_1.mongoUrl}`,
            err: err,
            errMessage: err.message,
        });
    else
        winston_1.default.info({ message: `Mongo connected to ${config_1.mongoUrl}` });
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
    winston_1.default.info({
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
app.use(config_1.apiBase, index_routes_1.default);
app.use((req, res) => {
    winston_1.default.error({ success: false, msg: `404 - Not Found; url: ${req.url}` });
    res.send({ success: false, msg: "404 - Not Found" });
});
module.exports = app;

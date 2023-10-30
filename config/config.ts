import dotenv from "dotenv";
import { toNumber } from "lodash";
dotenv.config();

const mongo = {
  host: `${process.env.MONGO_HOST}`,
  port: `${process.env.MONGO_PORT}`,
  Db: `${process.env.MONGO_DATABASE}`,
  sessionDb: `${process.env.SESSION_DATABASE}`,
};

const env = `${process.env.NODE_ENV}`;

const allowedDomains: (string | RegExp)[] = [];

if (env === "development") {
  allowedDomains.push("http://localhost:3001");
  allowedDomains.push("http://localhost:3002");
}

if (env === "production") {
  allowedDomains.push("http://localhost:3001");
  allowedDomains.push("https://manubrothers.com");
  allowedDomains.push("https://admin.manubrothers.com");
}

const config = {
  env,
  port: toNumber(`${process.env.PORT}`),
  mongoUrl: `mongodb://${mongo.host}:${mongo.port}/${mongo.Db}`,
  sessionUrl: `mongodb://${mongo.host}:${mongo.port}/${mongo.sessionDb}`,
  jwtSecret: `${process.env.JWT_SECRET}`,
  sessionSecret: `${process.env.SESSION_SECRET}`,
  apiBase: `${process.env.API_BASE}`,
  allowedDomains,
  awsAccess: `${process.env.AWS_ACCESS_KEY}`,
  awsSecret: `${process.env.AWS_SECRET_KEY}`,
  awsRegion: `${process.env.AWS_REGION}`,
  awsLogGroup: `${process.env.AWS_LOG_GROUP}`,
  awsS3Files: `${process.env.AWS_S3_FILES_BUCKET}`,
  googleClientId: `${process.env.GOOGLE_CLIENT_ID}`,
  googleClientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  googleCallback: `${process.env.GOOGLE_CALLBACK}`,
  razorpayKey: `${process.env.RAZORPAY_KEY}`,
  razorpaySecret: `${process.env.RAZORPAY_SECRET}`,
  instamojoApiKey: `${process.env.INSTAMOJO_API_KEY}`,
  instamojoAuthToken: `${process.env.INSTAMOJO_AUTH_TOKEN}`,
  orderWebRoute: `${process.env.ORDER_WEB_ROUTE}`,
  shopWebRoute: `${process.env.SHOP_WEB_ROUTE}`,
};

export = config;

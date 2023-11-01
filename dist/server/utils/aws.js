"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePolicy = exports.s3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const config_1 = require("../../config/config");
const date_1 = require("./date");
const { Types: { ObjectId }, } = mongoose_1.Schema;
exports.s3 = new aws_sdk_1.S3({
    credentials: {
        accessKeyId: config_1.awsAccess,
        secretAccessKey: config_1.awsSecret,
    },
    region: config_1.awsRegion,
});
const generatePolicy = (userId, mime, path, headers = {}, callback) => {
    const filePath = `${(0, crypto_1.createHash)("sha256")
        .update(`${userId}/${(0, date_1.getToday)("DD-MM-YYYY hh:mm:ss A")}`)
        .digest("hex")}/${(0, crypto_1.createHash)("sha256")
        .update(`${userId}/${path}`)
        .digest("hex")}`;
    return exports.s3.createPresignedPost({
        Bucket: config_1.awsS3Files,
        Expires: 3600,
        Conditions: [{ key: filePath }],
        Fields: Object.assign({ acl: "public-read", key: filePath, mime, "content-type": mime }, headers),
    }, (err, data) => callback(err, data, filePath));
};
exports.generatePolicy = generatePolicy;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const lodash_1 = require("lodash");
const winston_1 = require("winston");
const winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
const date_1 = require("../server/utils/date");
const config_1 = require("./config");
const logger = (0, winston_1.createLogger)();
if (config_1.env === "development") {
    logger.add(new winston_1.transports.File({
        filename: `logs/${(0, date_1.getToday)()}.log`,
        format: winston_1.format.json(),
    }));
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.json(),
        log: (info, next) => {
            if (!info.meta)
                console.log({
                    level: (0, lodash_1.get)(info, "level", ""),
                    message: (0, lodash_1.get)(info, "message", ""),
                });
            if (info.meta)
                console.log(info.meta);
            next();
        },
    }));
}
else {
    logger.add(new winston_cloudwatch_1.default({
        awsOptions: {
            credentials: {
                accessKeyId: config_1.awsAccess,
                secretAccessKey: config_1.awsSecret,
            },
            region: config_1.awsRegion,
        },
        logGroupName: config_1.awsLogGroup,
        logStreamName: () => (0, date_1.getToday)("DD-MMM-YYYY"),
        jsonMessage: true,
    }));
}
module.exports = logger;

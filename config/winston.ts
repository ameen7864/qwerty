import { get } from "lodash";
import { createLogger, format, transports } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { getToday } from "../server/utils/date";
import { awsAccess, awsLogGroup, awsRegion, awsSecret, env } from "./config";

const logger = createLogger();

if (env === "development") {
  logger.add(
    new transports.File({
      filename: `logs/${getToday()}.log`,
      format: format.json(),
    })
  );
  logger.add(
    new transports.Console({
      format: format.json(),
      log: (info, next) => {
        if (!info.meta)
          console.log({
            level: get(info, "level", ""),
            message: get(info, "message", ""),
          });
        if (info.meta) console.log(info.meta);
        next();
      },
    })
  );
} else {
  logger.add(
    new WinstonCloudwatch({
      awsOptions: {
        credentials: {
          accessKeyId: awsAccess,
          secretAccessKey: awsSecret,
        },
        region: awsRegion,
      },
      logGroupName: awsLogGroup,
      logStreamName: () => getToday("DD-MMM-YYYY"),
      jsonMessage: true,
    })
  );
}

export = logger;

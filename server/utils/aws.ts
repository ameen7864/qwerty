import { S3 } from "aws-sdk";
import { createHash } from "crypto";
import { Schema } from "mongoose";
import {
  awsAccess,
  awsRegion,
  awsS3Files,
  awsSecret,
} from "../../config/config";
import { getToday } from "./date";

const {
  Types: { ObjectId },
} = Schema;

export const s3 = new S3({
  credentials: {
    accessKeyId: awsAccess,
    secretAccessKey: awsSecret,
  },
  region: awsRegion,
});

export const generatePolicy = (
  userId: string | typeof ObjectId,
  mime: string,
  path: string,
  headers: any = {},
  callback: (err: any, data: any, filePath: any) => void
) => {
  const filePath = `${createHash("sha256")
    .update(`${userId}/${getToday("DD-MM-YYYY hh:mm:ss A")}`)
    .digest("hex")}/${createHash("sha256")
    .update(`${userId}/${path}`)
    .digest("hex")}`;

  return s3.createPresignedPost(
    {
      Bucket: awsS3Files,
      Expires: 3600,
      Conditions: [{ key: filePath }],
      Fields: {
        acl: "public-read",
        key: filePath,
        mime,
        "content-type": mime,
        ...headers,
      },
    },
    (err, data) => callback(err, data, filePath)
  );
};

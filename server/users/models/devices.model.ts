import { model, Schema } from "mongoose";
import IDevice from "../types/devices";

const {
  Types: { ObjectId },
} = Schema;

const schema = new Schema(
  {
    deviceId: { type: String, required: true, unique: true },
    user: { type: ObjectId, ref: "Users" },
    browser: String,
    platform: String,
    ip: String,
    os: String,
    version: String,
  },
  { timestamps: true }
);

const DeviceModel = model<IDevice>("Devices", schema);

export = DeviceModel;

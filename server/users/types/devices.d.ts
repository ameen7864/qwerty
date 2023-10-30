import { Document } from "mongoose";
import IUser from "./users";

interface IDevice extends Document {
  deviceId: string;
  user: IUser;
  browser: string;
  platform: string;
  ip: string;
  os: string;
  version: string;
}

export = IDevice;

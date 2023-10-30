import { Document } from "mongoose";
import { IDevice } from "./devices";

interface INewsletter extends Document {
  email: string;
  device: IDevice;
  isArchived: boolean;
}

export = INewsletter;

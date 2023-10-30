import { Document } from "mongoose";
import IUser from "../../users/types/users";

interface IRandomProductGeneration extends Document {
  user: IUser;
  generatedOn: Date;
}

export = IRandomProductGeneration;

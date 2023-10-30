import { Document } from "mongoose";
import IUser from "../../users/types/users";

interface ICard extends Document {
  number: string;
  network: string;
  type: string;
  user: IUser;
  cvv: string;
}

export = ICard;

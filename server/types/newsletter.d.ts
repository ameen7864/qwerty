import { Document } from "mongoose";
import IUser from "../users/types/users";

interface INewsletter extends Document{
    email: string;
    user: IUser;
    agent: string;
}
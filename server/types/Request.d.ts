import { Request, Response } from "express";
import IUser from "../users/types/users";

interface Payload {
  id: string;
  role: string;
}

interface Locals {
  user: IUser;
}

declare global {
  interface any extends any {
    payload: Payload;
  }
  interface any extends any {
    locals: Locals;
  }
  interface any extends Request {}
  interface any extends Response {}
}

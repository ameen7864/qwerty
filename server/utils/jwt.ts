import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../config/config";

export const generateJWT = ({ id, role }: { id?: string; role?: string }) =>
  jwt.sign({ id, role }, jwtSecret, { algorithm: "HS256", expiresIn: "60d" });

export const verifyJWT: (str: string) => JwtPayload | string | null = (
  str: string
) => {
  try {
    return jwt.verify(str, jwtSecret);
  } catch (err) {
    return null;
  }
};

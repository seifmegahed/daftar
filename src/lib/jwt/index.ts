import { env } from "@/env";
import type { UserDataType } from "@/server/db/tables/user/schema";
import { jwtVerify, SignJWT } from "jose";

const jwtSecret = env.JWT_SECRET;
const tokenTTL = "1d";

type TokenPayloadType = Pick<UserDataType, "username" | "role" | "id">;

export const createToken = (payload: TokenPayloadType) => {
  const token = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(tokenTTL)
    .sign(new TextEncoder().encode(jwtSecret));
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwtVerify(token, new TextEncoder().encode(jwtSecret));
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

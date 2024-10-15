import { env } from "@/env";
import { jwtVerify, SignJWT } from "jose";
import type { JWTPayload, JWTVerifyResult } from "jose";
import type { UserDataType } from "@/server/db/tables/user/schema";
import type { ReturnTuple } from "@/utils/type-utils";

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

export const verifyToken = async (
  token: string,
): Promise<ReturnTuple<JWTVerifyResult<JWTPayload>>> => {
  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
    return [decoded, null];
  } catch (error) {
    console.error("Error verifying token:", error);
    return [null, "Error verifying token"];
  }
};

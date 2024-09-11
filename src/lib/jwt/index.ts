import { env } from "@/env";
import { jwtVerify, SignJWT } from "jose";

const jwtSecret = env.JWT_SECRET;
// const expiresIn = "5d";

export const createToken = (username: string, role: string) => {
  const token = new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60s")
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

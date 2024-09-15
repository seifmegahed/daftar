import { getErrorMessage } from "@/lib/exceptions";
import * as bcrypt from "bcrypt";
import type { ReturnTuple } from "../type-utils";
const saltRounds = 10;

export async function hashPassword(
  password: string,
): Promise<ReturnTuple<string>> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!hashedPassword) throw new Error("Hashing failed");
    return [hashedPassword, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
}

export async function comparePassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
  }
}

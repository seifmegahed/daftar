import { errorLogger, getErrorMessage } from "@/lib/exceptions";
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
const compareErrorLog = errorLogger("Compare Password Error:");
export async function comparePassword(
  password: string,
  hash: string,
): Promise<ReturnTuple<boolean>> {
  try {
    const result = await bcrypt.compare(password, hash);
    if (!result) return [null, "Incorrect Password"];
    return [true, null];
  } catch (error) {
    compareErrorLog(error);
    return [null, "An error occurred while checking password"];
  }
}

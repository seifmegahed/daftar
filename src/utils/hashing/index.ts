import * as bcrypt from "bcrypt";
const saltRounds = 10;

export async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

export async function comparePassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
  }
}

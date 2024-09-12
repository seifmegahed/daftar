"use server";

import type { z } from "zod";

import { UserSchema } from "@/server/db/tables/user";
import {
  getUserByUsername,
  updateUserPassword,
} from "@/server/db/tables/user/queries";
import { hashPassword } from "@/utils/hashing";
import { checkPasswordComplexity } from "@/utils/password-complexity";

const changePasswordSchema = UserSchema.pick({
  username: true,
  password: true,
  verifyPassword: true,
}).superRefine((data) => {
  if (data.password !== data.verifyPassword) {
    throw new Error("Passwords don't match");
  }
  if (!checkPasswordComplexity(data.password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    );
  }
});

type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

export const changePasswordAction = async (data: ChangePasswordFormType) => {
  const isValid = changePasswordSchema.safeParse(data);

  if (!isValid.success) {
    throw new Error("Invalid data");
  }

  const user = await getUserByUsername(data.username);
  if (!user) throw new Error("User not found");

  const saltedPassword = await hashPassword(data.password);
  if (!saltedPassword) throw new Error("Error hashing password");

  return await updateUserPassword(user.id, saltedPassword);
};

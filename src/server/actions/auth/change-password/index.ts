"use server";

import { type z } from "zod";

import { UserSchema } from "@/server/db/tables/user/schema";
import {
  getUserByUsername,
  updateUserPassword,
} from "@/server/db/tables/user/queries";
import { hashPassword } from "@/utils/hashing";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import type { ReturnTuple } from "@/utils/type-utils";

import { changePasswordErrors } from "./errors";

const changePasswordSchema = UserSchema.pick({
  username: true,
  password: true,
  verifyPassword: true,
}).superRefine(
  (data) =>
    data.password !== data.verifyPassword ||
    !checkPasswordComplexity(data.password),
);

type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

export const changePasswordAction = async (
  data: ChangePasswordFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = changePasswordSchema.safeParse(data);

  if (!isValid.success) {
    return [null, changePasswordErrors.invalidData];
  }

  const user = await getUserByUsername(data.username);
  if (!user) return [null, changePasswordErrors.userNotFound];

  const saltedPassword = await hashPassword(data.password);
  if (!saltedPassword) return [null, changePasswordErrors.errorHashingPassword];

  return await updateUserPassword(user.id, saltedPassword);
};

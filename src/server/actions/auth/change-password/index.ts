"use server";

import type { ChangePasswordFormType } from "@/app/change-password/schema";
import {
  getUserByUserName,
  updateUserPassword,
} from "@/server/db/tables/user/queries";
import { hashPassword } from "@/utils/hashing";

export const changePasswordAction = async (data: ChangePasswordFormType) => {
  const user = await getUserByUserName(data.username);
  if (!user) throw new Error("User not found");

  const saltedPassword = await hashPassword(data.password);
  if (!saltedPassword) throw new Error("Error hashing password");

  return await updateUserPassword(user.id, saltedPassword);
};

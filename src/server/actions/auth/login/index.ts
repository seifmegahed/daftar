"use server";
import type { z } from "zod";

import { cookies } from "next/headers";
import { createToken } from "@/lib/jwt";

import { UserSchema } from "@/server/db/tables/user/schema";
import { getUserByUsername } from "@/server/db/tables/user/queries";
import { comparePassword } from "@/utils/hashing";
import { checkPasswordComplexity } from "@/utils/password-complexity";

const loginSchema = UserSchema.pick({
  username: true,
  password: true,
}).superRefine((data) => checkPasswordComplexity(data.password));

type LoginFormType = z.infer<typeof loginSchema>;

export const loginAction = async (data: LoginFormType) => {
  const isValid = loginSchema.safeParse(data);

  if (!isValid.success) {
    throw new Error("Invalid data");
  }

  const user = await getUserByUsername(data.username);

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User not initialized");
  if (!(await comparePassword(data.password, user.password)))
    throw new Error("Incorrect password");

  const token = await createToken(user.username, user.role);

  cookies().set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
};

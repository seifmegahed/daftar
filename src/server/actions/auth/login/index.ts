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

  if (!user) return { error: "User not found" };
  if (!(await comparePassword(data.password, user.password)))
    return { error: "Incorrect password" };

  const token = await createToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  cookies().set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
};

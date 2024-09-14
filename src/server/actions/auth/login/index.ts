"use server";
import type { z } from "zod";

import { cookies } from "next/headers";
import { createToken } from "@/lib/jwt";

import { UserSchema } from "@/server/db/tables/user/schema";
import { getUserByUsername } from "@/server/db/tables/user/queries";
import { comparePassword } from "@/utils/hashing";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import type { ReturnTuple } from "@/utils/type-utils";
import { loginErrors } from "./errors";

const loginSchema = UserSchema.pick({
  username: true,
  password: true,
}).superRefine((data) => checkPasswordComplexity(data.password));

type LoginFormType = z.infer<typeof loginSchema>;

export const loginAction = async (
  data: LoginFormType,
): Promise<ReturnTuple<boolean>> => {
  const isValid = loginSchema.safeParse(data);

  if (!isValid.success) {
    throw new Error("Invalid data");
  }

  const [user, error] = await getUserByUsername(data.username);

  if (error !== null) return [null, loginErrors.userNotFound];

  if (!(await comparePassword(data.password, user.password)))
    return [null, loginErrors.incorrectPassword];

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
  return [true, null];
};

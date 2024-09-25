"use server";
import type { z } from "zod";

import { cookies } from "next/headers";
import { createToken } from "@/lib/jwt";

import { UserSchema } from "@/server/db/tables/user/schema";
import {
  sensitiveGetUserByUsername,
  updateUserLastActive,
} from "@/server/db/tables/user/queries";
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
): Promise<ReturnTuple<number>> => {
  const isValid = loginSchema.safeParse(data);

  if (!isValid.success)
    return [null, loginErrors.invalidData];

  const [user, error] = await sensitiveGetUserByUsername(data.username);

  if (error !== null) return [null, error];

  if (!(await comparePassword(data.password, user.password)))
    return [null, loginErrors.incorrectPassword];

  if (!user.active) return [null, loginErrors.userNotActive];

  await updateUserLastActive(user.id);

  const token = await createToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  if (!token) return [null, loginErrors.tokenGenerationError];

  cookies().set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return [user.id, null];
};

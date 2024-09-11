"use server";

import { cookies } from "next/headers";

import type { LoginFormType } from "@/app/login/schema";
import { getUserByUserName } from "@/server/db/tables/user/queries";
import { comparePassword } from "@/utils/hashing";
import { createToken } from "@/lib/jwt";

// const daysToSeconds = (days: number) => days * 24 * 60 * 60;

export const loginAction = async (data: LoginFormType) => {
  const user = await getUserByUserName(data.username);

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User not initialized");
  if (!(await comparePassword(data.password, user.password)))
    throw new Error("Incorrect password");

  const token = await createToken(user.username, "user");

  cookies().set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    // maxAge: daysToSeconds(5),
  });
};

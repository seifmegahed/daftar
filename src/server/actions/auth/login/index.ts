"use server";

import type { LoginFormType } from "@/app/login/schema";
import { createSession } from "@/server/db/tables/sessions/queries";
import { getUserByUserName } from "@/server/db/tables/user/queries";
import { comparePassword } from "@/utils/hashing";

export const loginAction = async (data: LoginFormType) => {
  const user = await getUserByUserName(data.username);

  if (!user) return new Error("User not found");
  if (!user.password) return new Error("User not initialized");
  if (!(await comparePassword(data.password, user.password)))
    return new Error("Incorrect password");

  const token = await createSession(user.id);
  if (!token) return new Error("Could not create session");
  
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
};

"use server";

import { createUserRequest } from "@/server/db/tables/user-request/mutations";
import { hashPassword } from "@/utils/hashing";
import type { ReturnTuple } from "@/utils/type-utils";

export const createUserRequestAction = async (data: {
  email: string;
  username: string;
  name: string;
  password: string;
}): Promise<ReturnTuple<string>> => {
  const [password] = await hashPassword(data.password);
  if (!password) return [null, "Error creating user request"];

  const [id, error] = await createUserRequest({
    ...data,
    password,
  });
  if (error !== null) return [null, error];

  return [id, null];
};

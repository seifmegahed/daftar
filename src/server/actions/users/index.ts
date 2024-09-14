"use server";
import { getErrorMessage } from "@/lib/exceptions";
import {
  getAllUsers,
  getUserById,
  insertNewUser,
} from "@/server/db/tables/user/queries";
import { type UserDataType, UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import type { z } from "zod";
import { userErrors } from "./errors";
import type { ReturnTuple } from "@/utils/type-utils";

type PartialUser = Pick<UserDataType, "id" | "username" | "role"> & {
  name: string | null;
};

export const getAllUsersAction = async (): Promise<
  ReturnTuple<PartialUser[]>
> => {
  try {
    return await getAllUsers();
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getUserByIdAction = async (
  id: number,
): Promise<ReturnTuple<PartialUser>> => {
  try {
    const user = await getUserById(id);
    if (!user) return [null, userErrors.userNotFound];
    return [user, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

const addUserSchema = UserSchema.pick({
  name: true,
  username: true,
  password: true,
  verifyPassword: true,
  role: true,
}).superRefine(
  (data) =>
    !checkPasswordComplexity(data.password) ||
    data.password !== data.verifyPassword,
);

type AddUserFormType = z.infer<typeof addUserSchema>;

export const addUserAction = async (
  data: AddUserFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addUserSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  return await insertNewUser(data);
};

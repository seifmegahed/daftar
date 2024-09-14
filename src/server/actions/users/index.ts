"use server";
import { getErrorMessage } from "@/lib/exceptions";
import {
  getAllUsers,
  getUserById,
  insertNewUser,
} from "@/server/db/tables/user/queries";
import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import type { z } from "zod";
import { userErrors } from "./errors";
import type { ReturnTuple } from "@/utils/type-utils";

export const getAllUsersAction = async () => {
  try {
    const allUsers = await getAllUsers();
    return allUsers ?? [];
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
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

export const getUserByIdAction = async (id: number) => {
  try {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

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
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

type PartialUser = Pick<UserDataType, "id" | "username" | "role" | "name">;

export const getCurrentUserAction = async (): Promise<
  ReturnTuple<PartialUser>
> => {
  const token = cookies().get("token");
  if (!token) return [null, userErrors.userNotFound];
  const decoded = await verifyToken(token.value);
  if (decoded === null) return [null, userErrors.userNotFound];
  const id = Number(decoded.payload.id);
  if (isNaN(id)) return [null, userErrors.userNotFound];
  return await getUserByIdAction(id);
};

export const getAllUsersAction = async (): Promise<
  ReturnTuple<PartialUser[]>
> => {
  try {
    const [allUsers, error] = await getAllUsers();
    if (error !== null) return [null, error];
    return [allUsers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getUserByIdAction = async (
  id: number,
): Promise<ReturnTuple<PartialUser>> => {
  try {
    return await getUserById(id);
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

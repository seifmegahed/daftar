"use server";
import { getErrorMessage } from "@/lib/exceptions";
import {
  getAllUsers,
  type GetPartialUserType,
  getUserById,
  insertNewUser,
  updateUserName,
  updateUserPassword,
  updateUserRole,
} from "@/server/db/tables/user/queries";
import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { userErrors } from "./errors";
import type { ReturnTuple } from "@/utils/type-utils";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { hashPassword } from "@/utils/hashing";
import type { z } from "zod";

export const getCurrentUserAction = async (): Promise<
  ReturnTuple<GetPartialUserType>
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
  ReturnTuple<GetPartialUserType[]>
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
): Promise<ReturnTuple<GetPartialUserType>> => {
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
}).refine(
  (data) =>
    !checkPasswordComplexity(data.password) ||
    data.password !== data.verifyPassword,
);

type CreateUserFormType = z.infer<typeof addUserSchema>;

export const createUserAction = async (
  data: CreateUserFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addUserSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [saltedPassword, error] = await hashPassword(data.password);

  if (error !== null) return [null, userErrors.hashFailed];

  const result = await insertNewUser({
    name: data.name,
    username: data.username,
    password: saltedPassword,
    role: data.role,
  });
  return result;
};

const updateUserPasswordSchema = UserSchema.pick({
  id: true,
  password: true,
  verifyPassword: true,
}).refine(
  (data) =>
    !checkPasswordComplexity(data.password) ||
    data.password !== data.verifyPassword,
);

type UpdateUserPasswordFormType = z.infer<typeof updateUserPasswordSchema>;

export const updateUserPasswordAction = async (
  data: UpdateUserPasswordFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateUserPasswordSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [saltedPassword, error] = await hashPassword(data.password);

  if (error !== null) return [null, userErrors.hashFailed];

  const result = await updateUserPassword(data.id, saltedPassword);

  return result;
};

const updateUserNameSchema = UserSchema.pick({
  id: true,
  name: true,
});

type UpdateUserNameFormType = z.infer<typeof updateUserNameSchema>;

export const updateUserNameAction = async (
  data: UpdateUserNameFormType,
): Promise<ReturnTuple<boolean>> => {
  const isValid = updateUserNameSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];
  const result = await updateUserName(data.id, data.name);
  return result;
};

const updateUserRoleSchema = UserSchema.pick({
  id: true,
  role: true,
});

type UpdateUserRoleFormType = z.infer<typeof updateUserRoleSchema>;

export const updateUserRoleAction = async (
  data: UpdateUserRoleFormType,
): Promise<ReturnTuple<boolean>> => {
  const isValid = updateUserRoleSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];
  const result = await updateUserRole(data.id, data.role);
  return result;
};

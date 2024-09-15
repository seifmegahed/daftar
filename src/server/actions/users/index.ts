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

/**
 * Refine passwords to check if they are complex enough and if they match
 * because you can never trust the client!
 *
 * @param data - Data to check
 *   - password: Password to check
 *   - verifyPassword: password verification of the password to check against
 * @returns - True if passwords are complex enough and match, false otherwise
 */
const refinePasswords = (data: { password: string; verifyPassword: string }) =>
  !checkPasswordComplexity(data.password) ||
  data.password === data.verifyPassword;

/**
 * Get Current User
 *
 * Server Action to get the current user's information
 * Uses cookies to get the token and verify it.
 * If the token is invalid or expired, returns an error message.
 *
 * If the token is valid, decodes the token and gets the user's ID.
 * Then gets the user's information from the database.
 *
 * User information returned is a partial user object, which means it only contains some of the columns from the user table.
 * The partial user object is used to avoid sending sensitive information like passwords to the client.
 *
 * @returns - Tuple containing the current user's information or an error message if there is one
 **/
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

/**
 * Get All Users
 *
 * Server Action to get all users from the database.
 *
 * Users information returned is an array of partial user objects, which means it only contains some of the columns from the user table.
 * The partial user object is used to avoid sending sensitive information like passwords to the client.
 *
 * @returns - Tuple containing an array of all users or an error message if there is one
 */
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

/**
 * Get User By ID
 *
 * Server Action to get a user's information from the database.
 *
 * @param id - ID of the user to get
 * @returns - Tuple containing the user's information or an error message if there is one
 */
export const getUserByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetPartialUserType>> => {
  try {
    return await getUserById(id);
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/******************************************************************************/
/*                                                                            */
/*                                                                            */
/*                           Admin Only Actions                               */
/*                                                                            */
/*                                                                            */
/******************************************************************************/

/**
 * checkAdminPermissions - Private Function
 *
 * Checks if the requesting user has admin permissions.
 * Gets the token from the cookies and verifies it.
 * Token's protected payload contains the user's role.
 * The token is decoded and the role is checked.
 *
 * @returns - Tuple containing true if the requesting user has admin permissions or an error message if there is one
 */
async function checkAdminPermissions(): Promise<ReturnTuple<boolean>> {
  const token = cookies().get("token");
  if (!token) return [null, userErrors.tokenNotFound];

  const decoded = await verifyToken(token.value);
  if (!decoded?.payload) return [null, userErrors.tokenNotFound];

  const role = decoded.payload.role;
  if (role !== "admin") return [null, userErrors.invalidPermissions];

  return [true, null];
}

/**
 * Add User - Admin Only
 *
 * Admin Server Action to add a new user.
 *
 * Checks if the requesting user has admin permissions
 *
 * Password is hashed before being stored in the database.
 *
 * @param data - Data to add a new user
 *   - name: Name of the user
 *   - username: Username of the user
 *   - password: Password of the user
 *   - verifyPassword: Password verification of the password
 *   - role: Role of the user
 * @returns - Tuple containing the ID of the new user or an error message if there is one
 */
const addUserSchema = UserSchema.pick({
  name: true,
  username: true,
  password: true,
  verifyPassword: true,
  role: true,
}).refine(refinePasswords);

type CreateUserFormType = z.infer<typeof addUserSchema>;

export const createUserAction = async (
  data: CreateUserFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];
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

/**
 * Update User Password - Admin Only
 *
 * Admin Server Action to update a user's password.
 * Intended to be used if a user forgets their password.
 *
 * Checks if the requesting user has admin permissions
 *
 * Password is hashed before being stored in the database.
 *
 * @param data - Data to update the user's password
 *   - id: ID of the user to update
 *   - password: New password of the user
 *   - verifyPassword: password verification of the new password
 * @returns - Tuple containing the updated user's ID or an error message if there is one
 */
const updateUserPasswordSchema = UserSchema.pick({
  id: true,
  password: true,
  verifyPassword: true,
}).refine(refinePasswords);

type UpdateUserPasswordFormType = z.infer<typeof updateUserPasswordSchema>;

export const updateUserPasswordAction = async (
  data: UpdateUserPasswordFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserPasswordSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [saltedPassword, error] = await hashPassword(data.password);
  if (error !== null) return [null, userErrors.hashFailed];

  const result = await updateUserPassword(data.id, saltedPassword);
  return result;
};

/**
 * Update User Name - Admin Only
 *
 * Admin Server Action to update a user's name
 *
 * Checks if the requesting user has admin permissions
 *
 * @param data - Data to update the user's name
 *   - id: ID of the user to update
 *   - name: New name of the user
 * @returns - Tuple containing the updated user's ID or an error message if there is one
 */
const updateUserNameSchema = UserSchema.pick({
  id: true,
  name: true,
});

type UpdateUserNameFormType = z.infer<typeof updateUserNameSchema>;

export const updateUserNameAction = async (
  data: UpdateUserNameFormType,
): Promise<ReturnTuple<boolean>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserNameSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const result = await updateUserName(data.id, data.name);
  return result;
};

/**
 * Update User Role - Admin Only
 *
 * Admin Server Action to update a user's role
 *
 * Checks if the requesting user has admin permissions
 *
 * @param data - Data to update the user's role
 *   - id: ID of the user to update
 *   - role: New role of the user
 * @returns - Tuple containing the updated user's ID or an error message if there is one
 */
const updateUserRoleSchema = UserSchema.pick({
  id: true,
  role: true,
});

type UpdateUserRoleFormType = z.infer<typeof updateUserRoleSchema>;

export const updateUserRoleAction = async (
  data: UpdateUserRoleFormType,
): Promise<ReturnTuple<boolean>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserRoleSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const result = await updateUserRole(data.id, data.role);
  return result;
};

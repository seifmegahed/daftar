"use server";

import { getErrorMessage } from "@/lib/exceptions";
import {
  changeUserActiveState,
  getAllUsers,
  getUserById,
  getUsersCount,
  insertNewUser,
  listAllUsers,
  sensitiveGetUserPasswordById,
  updateUserName,
  updateUserPassword,
  updateUserRole,
  type GetPartialUserType,
  type UserBriefType,
} from "@/server/db/tables/user/queries";
import { UserSchema, UserSchemaRaw } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { userErrors } from "./errors";
import type { ReturnTuple } from "@/utils/type-utils";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/utils/hashing";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkUsername } from "@/utils/user-name-check";

/**
 * Refine passwords to check if they are complex enough and if they match
 * because you can never trust the client!
 *
 * @param data - Data to check
 *   - password: Password to check
 *   - verifyPassword: password verification of the password to check against
 * @returns True if passwords are complex enough and match, false otherwise
 */
const refinePasswords = (data: { password: string; verifyPassword: string }) =>
  !checkPasswordComplexity(data.password) ||
  data.password === data.verifyPassword;

export const listAllUsersAction = async (): Promise<
  ReturnTuple<UserBriefType[]>
> => {
  const [users, error] = await listAllUsers();
  if (error !== null) return [null, error];
  return [users, null];
};

export const isCurrentUserAdminAction = async (): Promise<
  ReturnTuple<boolean>
> => {
  const [user, error] = await getCurrentUserAction();
  if (error !== null) return [null, error];
  return [user.role === "admin", null];
};

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
 * @returns Tuple containing either the current user's information or an error message if there is one
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

  const [user, error] = await getUserByIdAction(id);

  if (error !== null) return [null, error];
  return [user, null];
};

/**
 * Get Current User Id
 *
 * Server Action to get the current user's id
 * Uses cookies to get the token and verify it.
 * If the token is invalid or expired, returns an error message.
 *
 * If the token is valid, decodes the token and gets the user's ID.
 *
 * @returns Tuple containing either the current user's id or an error message if there is one
 **/
export const getCurrentUserIdAction = async (): Promise<
  ReturnTuple<number>
> => {
  const token = cookies().get("token");
  if (!token) return [null, userErrors.userNotFound];
  const decoded = await verifyToken(token.value);
  if (decoded === null) return [null, userErrors.userNotFound];
  const id = Number(decoded.payload.id);
  if (isNaN(id)) return [null, userErrors.userNotFound];
  return [id, null];
};

/**
 * Get All Users Server Action
 *
 * Server Action to get all users from the database.
 *
 * Users information returned is an array of partial user objects, which means it only contains some of the columns from the user table.
 * The partial user object is used to avoid sending sensitive information like passwords to the client.
 *
 * @returns Tuple containing either an array of all users or an error message if there is one
 */
export const getAllUsersAction = async (
  page?: number,
  limit?: number,
): Promise<ReturnTuple<GetPartialUserType[]>> => {
  try {
    const [allUsers, error] = await getAllUsers(page, limit);
    if (error !== null) return [null, error];
    return [allUsers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/**
 * Get Users Count Server Action
 *
 * @returns number of users in the database
 */
export const getUsersCountAction = async (): Promise<ReturnTuple<number>> => {
  const [usersCount, error] = await getUsersCount();
  if (error !== null) return [null, error];
  return [usersCount, null];
};

/**
 * Get User By ID
 *
 * Server Action to get a user's information from the database.
 *
 * @param id - ID of the user to get
 * @returns Tuple containing either the user's information or an error message if there is one
 */
export const getUserByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetPartialUserType>> => {
  const [user, error] = await getUserById(id);
  if (error !== null) return [null, error];
  return [user, null];
};

/******************************************************************************/
/*                                                                            */
/*                                                                            */
/*                        User Update Self Actions                            */
/*                                                                            */
/*                                                                            */
/******************************************************************************/

const updateUserDisplayNameSchema = UserSchema.pick({
  name: true,
});

type UpdateUserDisplayNameFormType = z.infer<
  typeof updateUserDisplayNameSchema
>;

/**
 * Update User Display Name - Same User Only
 *
 * User Server Action to update a user's display name
 *
 * @param data - Data to update the user's name
 *   - name: New name of the user
 * @returns Tuple containing either the updated user's ID or an error message if there is one
 */
export const userUpdateUserDisplayNameAction = async (
  data: UpdateUserDisplayNameFormType,
): Promise<ReturnTuple<number>> => {
  const [userId, userError] = await getCurrentUserIdAction();
  if (userError !== null) return [null, userError];

  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserDisplayNameSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [result, error] = await updateUserName(userId, data.name);
  if (error !== null) return [null, error];
  revalidatePath("/settings");
  return [result, null];
};

const userUpdateUserPasswordSchema = z
  .object({
    oldPassword: UserSchemaRaw.password,
    newPassword: UserSchemaRaw.password,
    verifyPassword: UserSchemaRaw.verifyPassword,
  })
  .refine(
    (data) =>
      !checkPasswordComplexity(data.oldPassword) ||
      data.oldPassword !== data.newPassword ||
      !checkPasswordComplexity(data.newPassword) ||
      data.newPassword === data.verifyPassword,
  );

type UserUpdateUserPasswordFormType = z.infer<
  typeof userUpdateUserPasswordSchema
>;

/**
 * Update User Password - Same User Only
 *
 * User Server Action to update a user's password.
 * Intended to be used if a user forgets their password.
 *
 * Checks if users old password is correct before updating to the new password to
 * verify the user.
 *
 * New Password is hashed before being stored in the database.
 *
 * @param data - Data to update the user's password
 *   - oldPassword: Old password of the user
 *   - newPassword: New password of the user
 *   - verifyPassword: password verification of the new password
 * @returns Tuple containing the updated user's ID or an error message if there is one
 */
export const userUpdateUserPasswordAction = async (
  data: UserUpdateUserPasswordFormType,
): Promise<ReturnTuple<number>> => {
  const [userId, currentUserError] = await getCurrentUserIdAction();
  if (currentUserError !== null) return [null, currentUserError];

  const isValid = userUpdateUserPasswordSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [password, getUserError] = await sensitiveGetUserPasswordById(userId);
  if (getUserError !== null) return [null, getUserError];

  const isValidPassword = await comparePassword(data.oldPassword, password);
  if (!isValidPassword) return [null, userErrors.incorrectPassword];

  const [hashedPassword, error] = await hashPassword(data.newPassword);
  if (error !== null) return [null, userErrors.hashFailed];

  const result = await updateUserPassword(userId, hashedPassword);
  revalidatePath("/settings");
  return result;
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

const addUserSchema = UserSchema.pick({
  name: true,
  username: true,
  password: true,
  verifyPassword: true,
  role: true,
})
  .refine(refinePasswords)
  .refine((data) => checkUsername(data.username));

type CreateUserFormType = z.infer<typeof addUserSchema>;

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
 * @returns Tuple containing either the ID of the new user or an error message if there is one
 */
export const adminCreateUserAction = async (
  data: CreateUserFormType,
): Promise<ReturnTuple<number> | undefined> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = addUserSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [hashedPassword, hashError] = await hashPassword(data.password);
  if (hashError !== null) return [null, userErrors.hashFailed];

  const [, error] = await insertNewUser({
    name: data.name,
    username: data.username,
    password: hashedPassword,
    role: data.role,
  });
  if (error !== null) return [null, error];
  revalidatePath("/admin");
  redirect("/admin");
};

const updateUserPasswordSchema = UserSchema.pick({
  id: true,
  password: true,
  verifyPassword: true,
}).refine(refinePasswords);

type UpdateUserPasswordFormType = z.infer<typeof updateUserPasswordSchema>;

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
 * @returns Tuple containing either the updated user's ID or an error message if there is one
 */
export const adminUpdateUserPasswordAction = async (
  data: UpdateUserPasswordFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserPasswordSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [hashedPassword, error] = await hashPassword(data.password);
  if (error !== null) return [null, userErrors.hashFailed];

  const result = await updateUserPassword(data.id, hashedPassword);
  return result;
};

const updateUserNameSchema = UserSchema.pick({
  id: true,
  name: true,
});

type UpdateUserNameFormType = z.infer<typeof updateUserNameSchema>;

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
 * @returns Tuple containing either the updated user's ID or an error message if there is one
 */
export const adminUpdateUserDisplayNameAction = async (
  data: UpdateUserNameFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserNameSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [result, error] = await updateUserName(data.id, data.name);
  if (error !== null) return [null, error];
  revalidatePath("/admin/");
  revalidatePath(`/admin/edit-user/${data.id}`);
  return [result, null];
};

const updateUserRoleSchema = UserSchema.pick({
  id: true,
  role: true,
});

type UpdateUserRoleFormType = z.infer<typeof updateUserRoleSchema>;

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
 * @returns Tuple containing either the updated user's ID or an error message if there is one
 */
export const adminUpdateUserRoleAction = async (
  data: UpdateUserRoleFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserRoleSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [result, error] = await updateUserRole(data.id, data.role);
  if (error !== null) return [null, error];
  revalidatePath("/admin/");
  revalidatePath(`/admin/edit-user/${data.id}`);
  return [result, null];
};

const updateUserActiveSchema = UserSchema.pick({
  id: true,
  active: true,
});

type UpdateUserActiveFormType = z.infer<typeof updateUserActiveSchema>;

/**
 * Update User Active State - Admin Only
 *
 * Admin Server Action to update a user's active state
 *
 * Checks if the requesting user has admin permissions
 *
 * @param data - Data to update the user's active state
 *   - @number  id: ID of the user to update
 *   - @boolean active: New active state of the user
 * @returns - Tuple containing the updated user's ID or an error message if there is one
 */
export const adminUpdateUserActiveAction = async (
  data: UpdateUserActiveFormType,
): Promise<ReturnTuple<number>> => {
  const [, isAdminError] = await checkAdminPermissions();
  if (isAdminError !== null) return [null, isAdminError];

  const isValid = updateUserActiveSchema.safeParse(data);
  if (!isValid.success) return [null, userErrors.invalidData];

  const [result, error] = await changeUserActiveState(data.id, data.active);
  if (error !== null) return [null, error];
  revalidatePath("/admin/");
  revalidatePath(`/admin/edit-user/${data.id}`);
  return [result, null];
};

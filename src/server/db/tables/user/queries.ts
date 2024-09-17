import { db } from "../..";
import { type UserDataType, users } from "./schema";
import { asc, eq, and } from "drizzle-orm";
import type { ReturnTuple } from "@/utils/type-utils";
import { getErrorMessage } from "@/lib/exceptions";
import { userErrors } from "@/server/actions/users/errors";

export type GetPartialUserType = Omit<
  UserDataType,
  "verifyPassword" | "password"
>;
export type SetPartialUser = Pick<
  UserDataType,
  "name" | "username" | "role" | "password"
>;

export const getAllUsers = async (): Promise<
  ReturnTuple<GetPartialUserType[]>
> => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        active: users.active,
        lastActive: users.lastActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(asc(users.id));

    return [allUsers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserRole = async (
  id: number,
  role: string,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [user.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserPassword = async (
  id: number,
  password: string,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [user.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const insertNewUser = async (
  userData: SetPartialUser,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning({ id: users.id });

    if (!user) throw new Error("Error inserting new user");
    return [user.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, userErrors.usernameAlreadyExists];
    return [null, errorMessage];
  }
};

export const getUserById = async (
  id: number,
): Promise<ReturnTuple<GetPartialUserType>> => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        active: users.active,
        lastActive: users.lastActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id));
    if (!user) return [null, userErrors.userNotFound];
    return [user, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const changeUserActiveState = async (
  id: number,
  active: boolean,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ active })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [user.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserLastActive = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ lastActive: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [user.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/**
 * Sensitive Get User Password By ID
 * 
 * This function is intended to be used on the server side, and is not intended
 * to be used on the client side because it contains sensitive information
 * like passwords.
 * 
 * Primary usage of this function is to use the data to verify a user's password.
 * 
 * @param id - ID of the user to get
 * @returns - Tuple containing the user's information or an error message if there is one
 */
export const sensitiveGetUserPasswordById = async (
  id: number,
): Promise<ReturnTuple<string>> => {
  try {
    const [user] = await db
      .select({
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user) return [null, userErrors.userNotFound];

    return [user.password, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/**
 *
 * Sensitive Get User By Username
 *
 * Get a user by username, and return some columns from the user table.
 *
 * This function is intended to be used on the server side, and is not intended
 * to be used on the client side because it contains sensitive information
 * like passwords.
 *
 * Primary usage of this function is to use the data to login a user.
 * 
 * User must be active to be able to login.
 *
 * @param username
 * @returns - Tuple containing the user's information or an error message if there is one
 */
type SensitiveGetUserType = Pick<
  UserDataType,
  "id" | "name" | "username" | "role" | "active" | "password"
>;

export const sensitiveGetUserByUsername = async (
  username: string,
): Promise<ReturnTuple<SensitiveGetUserType>> => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        active: users.active,
        password: users.password,
      })
      .from(users)
      .where(and(eq(users.username, username), eq(users.active, true)));

    if (!user) return [null, userErrors.userNotFound];

    return [user, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserName = async (
  id: number,
  name: string,
): Promise<ReturnTuple<number>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [user.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

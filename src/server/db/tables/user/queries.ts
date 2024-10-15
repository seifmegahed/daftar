import { db } from "@/server/db";
import { type UserDataType, usersTable } from "./schema";
import { asc, eq, and, count, desc } from "drizzle-orm";
import type { ReturnTuple } from "@/utils/type-utils";
import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";

const errorMessages = {
  mainTitle: "User Queries Error:",
  getUsers: "An error occurred while getting users",
  getUser: "An error occurred while getting user",
  notFound: "User not found",
  insert: "An error occurred while adding user",
  nameExists: "User username already exists",
  count: "An error occurred while counting users",
  update: "An error occurred while updating users",
  delete: "An error occurred while deleting users",
};

const logError = errorLogger(errorMessages.mainTitle);

export type GetPartialUserType = Omit<
  UserDataType,
  "verifyPassword" | "password"
>;
export type SetPartialUser = Pick<
  UserDataType,
  "name" | "username" | "role" | "password"
>;

export const getAllUsers = async (
  page = 1,
  limit = defaultPageLimit,
): Promise<ReturnTuple<GetPartialUserType[]>> => {
  const errorMessage = errorMessages.getUsers;
  try {
    const allUsers = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        role: usersTable.role,
        active: usersTable.active,
        lastActive: usersTable.lastActive,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.id))
      .limit(limit)
      .offset((page - 1) * limit);

    return [allUsers, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getUsersCount = async (): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [usersCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .limit(1);

    if (!usersCount) return [null, errorMessage];
    return [usersCount.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateUserRole = async (
  id: number,
  role: string,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateUserPassword = async (
  id: number,
  password: string,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ password })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const insertNewUser = async (
  userData: SetPartialUser,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [user] = await db.insert(usersTable).values(userData).returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [
      null,
      checkUniqueConstraintError(error)
        ? errorMessages.nameExists
        : errorMessage,
    ];
  }
};

export const getUserById = async (
  id: number,
): Promise<ReturnTuple<GetPartialUserType>> => {
  const errorMessage = errorMessages.getUser;
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        role: usersTable.role,
        active: usersTable.active,
        lastActive: usersTable.lastActive,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) return [null, errorMessages.notFound];
    return [user, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const changeUserActiveState = async (
  id: number,
  active: boolean,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ active })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateUserLastActive = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ lastActive: new Date() })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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
  const errorMessage = errorMessages.getUser;
  try {
    const [user] = await db
      .select({
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) return [null, errorMessages.notFound];

    return [user.password, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

type SensitiveGetUserType = Pick<
  UserDataType,
  "id" | "name" | "username" | "role" | "active" | "password"
>;

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
export const sensitiveGetUserByUsername = async (
  username: string,
): Promise<ReturnTuple<SensitiveGetUserType>> => {
  const errorMessage = errorMessages.getUser;
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        role: usersTable.role,
        active: usersTable.active,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(
        and(eq(usersTable.username, username), eq(usersTable.active, true)),
      );

    if (!user) return [null, errorMessages.notFound];

    return [user, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateUserName = async (
  id: number,
  name: string,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ name })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export type UserBriefType = {
  id: number;
  name: string;
  role?: string;
};

export const listAllUsers = async (): Promise<ReturnTuple<UserBriefType[]>> => {
  const errorMessage = errorMessages.getUsers;
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
      })
      .from(usersTable)
      .orderBy(asc(usersTable.name));

    if (!users) return [null, errorMessage];
    return [users, null];
  } catch (error) {
    logError(error);
    console.log(error);
    return [null, errorMessage];
  }
};

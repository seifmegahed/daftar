import { db } from "@/server/db";
import { asc, eq, and, count, desc } from "drizzle-orm";
import { usersTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";

import type { UserDataType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "User Queries Error:",
  getUsers: "An error occurred while getting users",
  getUser: "An error occurred while getting user",
  notFound: "User not found",
  count: "An error occurred while counting users",
};

const logError = errorLogger(errorMessages.mainTitle);

export type GetPartialUserType = Omit<
  UserDataType,
  "verifyPassword" | "password"
>;

export const getAllUsers = async (
  page = 1,
  limit = defaultPageLimit,
): Promise<ReturnTuple<GetPartialUserType[]>> => {
  const errorMessage = errorMessages.getUsers;
  const timer = new performanceTimer("getAllUsers");
  try {
    timer.start();
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
    timer.end();

    return [allUsers, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getUsersCount = async (): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getUsersCount");
  try {
    timer.start();
    const [usersCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .limit(1);
    timer.end();

    if (!usersCount) return [null, errorMessage];
    return [usersCount.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getUserById = async (
  id: number,
): Promise<ReturnTuple<GetPartialUserType>> => {
  const errorMessage = errorMessages.getUser;
  const timer = new performanceTimer("getUserById");
  try {
    timer.start();
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
    timer.end();

    if (!user) return [null, errorMessages.notFound];
    return [user, null];
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
  const timer = new performanceTimer("sensitiveGetUserPasswordById");
  try {
    timer.start();
    const [user] = await db
      .select({
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    timer.end();

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
  const timer = new performanceTimer("sensitiveGetUserByUsername");
  try {
    timer.start();
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
    timer.end();

    if (!user) return [null, errorMessages.notFound];
    return [user, null];
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
  const timer = new performanceTimer("listAllUsers");
  try {
    timer.start();
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
      })
      .from(usersTable)
      .orderBy(asc(usersTable.name));
    timer.end();

    if (!users) return [null, errorMessage];
    return [users, null];
  } catch (error) {
    logError(error);
    console.log(error);
    return [null, errorMessage];
  }
};

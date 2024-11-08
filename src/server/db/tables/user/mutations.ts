import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { usersTable } from "@/server/db/schema";

import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";

import type { UserDataType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "User Mutation Error:",
  insert: "An error occurred while adding user",
  nameExists: "User username already exists",
  update: "An error occurred while updating users",
  delete: "An error occurred while deleting users",
  lock: "An error occurred while locking user",
  incrementWrongAttempts: "An error occurred while incrementing wrong attempts",
};

const logError = errorLogger(errorMessages.mainTitle);

type SetPartialUser = Pick<
  UserDataType,
  "name" | "username" | "role" | "password" | "email" | "phoneNumber"
>;

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
      .set({ lastActive: new Date(), wrongAttempts: 0 })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.id, null];
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

export const updateUser = async (
  id: number,
  data: Partial<SetPartialUser>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [user] = await db
      .update(usersTable)
      .set(data)
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
 * Increment wrong password attempts
 * 
 * @param id 
 * @returns 
 */
export const incrementWrongAttempts = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.incrementWrongAttempts;
  try {
    const [user] = await db
      .update(usersTable)
      .set({
        wrongAttempts: sql`${usersTable.wrongAttempts} + 1`,
      })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return [null, errorMessage];
    return [user.wrongAttempts, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};
/**
 * Lock User
 * 
 * Locks a user account for a specified amount of time.
 * Resets wrong attempts as well
 * 
 * @param id - ID of the user to lock
 * @param lockTimeHr - Number of hours to lock the user for
 * @returns - Tuple containing the updated user's ID or an error message if there is one
 */
export const lockUser = async (
  id: number,
  lockTimeHr = 1,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.lock;
  try {
    const [user] = await db
      .update(usersTable)
      .set({
        wrongAttempts: 0,
        lockedUntil: new Date(Date.now() + 1000 * 60 * 60 * lockTimeHr),
      })
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

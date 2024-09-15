import { db } from "../..";
import { type UserDataType, users } from "./schema";
import { eq } from "drizzle-orm";
import type { ReturnTuple } from "@/utils/type-utils";
import { getErrorMessage } from "@/lib/exceptions";
import { userErrors } from "@/server/actions/users/errors";

export type GetUserType = Omit<UserDataType, "verifyPassword">;
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
      .from(users);

    return [allUsers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getUserByUsername = async (
  username: string,
): Promise<ReturnTuple<GetUserType>> => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) return [null, userErrors.userNotFound];

    return [user, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserName = async (
  id: number,
  name: string,
): Promise<ReturnTuple<boolean>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [true, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateUserRole = async (
  id: number,
  role: string,
): Promise<ReturnTuple<boolean>> => {
  try {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("User not found");
    return [true, null];
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

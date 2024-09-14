import { db } from "../..";
import { type UserDataType, users } from "./schema";
import { eq } from "drizzle-orm";
import type { ReturnTuple } from "@/utils/type-utils";
import { getErrorMessage } from "@/lib/exceptions";
import { userErrors } from "@/server/actions/users/errors";

type PartialUser = Pick<UserDataType, "id" | "username" | "role" | "name">;

export const getAllUsers = async (): Promise<ReturnTuple<PartialUser[]>> => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
      })
      .from(users);

    return [allUsers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getUserByUsername = async (
  username: string,
): Promise<ReturnTuple<Omit<UserDataType, "verifyPassword">>> => {
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
  userData: Omit<UserDataType, "id" | "verifyPassword">,
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
): Promise<ReturnTuple<PartialUser>> => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));
    if (!user) return [null, userErrors.userNotFound];
    return [user, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

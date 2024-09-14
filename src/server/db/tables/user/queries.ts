import { db } from "../..";
import { type UserDataType, users } from "./schema";
import { eq } from "drizzle-orm";
import type { AtLeastOne, ReturnTuple } from "@/utils/type-utils";
import { getErrorMessage } from "@/lib/exceptions";
import { userErrors } from "@/server/actions/users/errors";

type PartialUser = Pick<UserDataType, "id" | "username" | "role"> & {
  name: string | null;
};

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

export const getUserByUsername = async (username: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  } catch (error) {
    console.error("Error getting user by username:", error);
  }
};

export const updateUser = async (
  id: number,
  userData: AtLeastOne<Pick<UserDataType, "name" | "role">>,
) => {
  try {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("Error updating user name");
    return user.id;
  } catch (error) {
    console.error("Error updating user name:", error);
    throw new Error("Could not update user name");
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

export const getUserById = async (id: number) => {
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
    return user;
  } catch (error) {
    console.error("Error getting user by id:", error);
  }
};

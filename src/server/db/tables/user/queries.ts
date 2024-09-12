import { db } from "../..";
import { type UserDataType, users } from "./schema";
import { eq } from "drizzle-orm";
import type { AtLeastOne } from "@/utils/type-utils";

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
      })
      .from(users);
    return allUsers;
  } catch (error) {
    console.error("Error getting all users:", error);
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

export const updateUserPassword = async (id: number, password: string) => {
  try {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!user) throw new Error("Error updating user password");
    return user.id;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Could not update user password");
  }
};

export const insertNewUser = async (
  userData: Omit<UserDataType, "id" | "verifyPassword">,
) => {
  try {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning({ id: users.id });

    if (!user) throw new Error("Error inserting new user");
    return user.id;
  } catch (error) {
    console.error("Error inserting new user:", error);
    if (error instanceof Error && error.message.includes("unique")) {
      throw new Error("Username already exists");
    }
    throw error;
  }
};

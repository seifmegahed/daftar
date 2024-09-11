import { db } from "../..";
import { users } from ".";
import { eq } from "drizzle-orm";

export const getUserByUserName = async (username: string) => {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, username));
  if (!user.length) {
    throw new Error("User not found");
  }
  return user[0];
};

export const updateUserPassword = async (id: number, password: string) => {
  await db
    .update(users)
    .set({ password })
    .where(eq(users.id, id));
};

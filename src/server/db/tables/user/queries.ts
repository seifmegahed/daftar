import { db } from "../..";
import { users } from ".";
import { eq } from "drizzle-orm";

export const getUserByUserName = async (username: string) => {
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

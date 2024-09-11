import * as crypto from "crypto";
import { sessions } from ".";
import { db } from "../..";

export const createSession = async (userId: number) => {
  try {
    // Get current date
    const now = new Date();

    // Get tomorrow's date
    const expiresAt = new Date(now);
    expiresAt.setDate(now.getDate() + 1); // Move to the next day
    expiresAt.setHours(2, 0, 0, 0); // Set time to 2:00 AM

    // Generate a random token
    const token = crypto.randomUUID();
    const [createdSession] = await db
      .insert(sessions)
      .values({
        userId,
        token,
        expiresAt,
      })
      .returning({ token: sessions.token });

    if (!createdSession) throw new Error("DB did not return a session");
    return createdSession.token;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Could not create session");
  }
};

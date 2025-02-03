import { userRoles } from "@/data/lut";
import { db } from "../..";
import { usersTable } from "../user/schema";
import { userRequestTable } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { eq } from "drizzle-orm";

export const createUserRequest = async (data: {
  email: string;
  username: string;
  name: string;
  password: string;
}): Promise<ReturnTuple<string>> => {
  try {
    const { email, username, name, password } = data;
    const [result] = await db
      .insert(userRequestTable)
      .values({
        email,
        username,
        name,
        password,
      })
      .returning();
    if (!result) return [null, "Error creating user request"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error creating user request"];
  }
};

export const convertUserRequest = async (
  code: string,
): Promise<ReturnTuple<boolean>> => {
  try {
    const result = await db.transaction(async (transaction) => {
      const [request] = await transaction
        .select()
        .from(userRequestTable)
        .where(eq(userRequestTable.id, code));

      if (!request) return false;

      const [user] = await transaction
        .insert(usersTable)
        .values({
          name: request.name,
          username: request.username,
          email: request.email,
          role: userRoles.sUser,
          active: true,
          password: request.password,
        })
        .returning();

      if (!user) return false;

      const [requestResult] = await transaction
        .update(userRequestTable)
        .set({
          status: true,
        })
        .where(eq(userRequestTable.id, code))
        .returning();

      if (!requestResult) return false;

      return true;
    });
    if (!result) return [null, "Error converting user request"];
    return [true, null];
  } catch (error) {
    console.log(error);
    return [null, "Error converting user request"];
  }
};

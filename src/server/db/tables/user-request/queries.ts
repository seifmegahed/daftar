import { eq } from "drizzle-orm";
import { userRequestTable } from "./schema";
import { db } from "../..";
import type { ReturnTuple } from "@/utils/type-utils";

export const getUserRequest = async (
  code: string,
): Promise<
  ReturnTuple<{
    id: string;
    email: string;
    username: string;
    name: string;
    password: string;
    createdAt: Date;
    status: boolean;
  }>
> => {
  try {
    const [result] = await db
      .select()
      .from(userRequestTable)
      .where(eq(userRequestTable.id, code));

    if (!result) return [null, "Error creating user request"];
    return [result, null];
  } catch (error) {
    console.log(error);
    return [null, "Error creating user request"];
  }
};

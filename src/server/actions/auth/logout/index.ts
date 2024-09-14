"use server";
import { getErrorMessage } from "@/lib/exceptions";
import type { ReturnTuple } from "@/utils/type-utils";
import { cookies } from "next/headers";

export const logoutAction = async (): Promise<ReturnTuple<boolean>> => {
  try {
    cookies().delete("token");
    return [true, null];
  } catch (error) {
    console.error("Error logging out:", error);
    return [null, getErrorMessage(error)];
  }
};

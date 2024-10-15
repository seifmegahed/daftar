"use server";
import { errorLogger } from "@/lib/exceptions";
import type { ReturnTuple } from "@/utils/type-utils";
import { cookies } from "next/headers";

const logoutErrorLog = errorLogger("Logout Action Error:");

export const logoutAction = async (): Promise<ReturnTuple<boolean>> => {
  try {
    cookies().delete("token");
    return [true, null];
  } catch (error) {
    logoutErrorLog(error);
    return [null, "Error logging out"];
  }
};

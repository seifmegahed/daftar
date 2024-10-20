"use server";
import { cookies } from "next/headers";

import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";
import { redirect } from "next/navigation";

const logoutErrorLog = errorLogger("Logout Action Error:");

export const logoutAction = async (): Promise<
  ReturnTuple<boolean> | undefined
> => {
  const [, error] = deleteCookie();
  if (error !== null) return [null, error];
  redirect("/login");
};

const deleteCookie = (): ReturnTuple<boolean> => {
  try {
    cookies().delete("token");
    return [true, null];
  } catch (error) {
    logoutErrorLog(error);
    return [null, "Error logging out"];
  }
};

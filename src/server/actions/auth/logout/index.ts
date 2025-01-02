"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";

const logoutErrorLog = errorLogger("Logout Action Error:");

export const logoutAction = async (): Promise<
  ReturnTuple<boolean> | undefined
> => {
  const locale = await getLocale();
  const [, error] = deleteCookie();
  if (error !== null) return [null, error];
  redirect({ href: "/login", locale });
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

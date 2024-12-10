"use server";

import { env } from "@/env";
import { redirect } from "@/i18n/routing";
import { cookies } from "next/headers";

import { sensitiveGetUserByUsername } from "@/server/db/tables/user/queries";
import {
  incrementWrongAttempts,
  lockUser,
  updateUserLastActive,
} from "@/server/db/tables/user/mutations";

import { createToken } from "@/lib/jwt";
import { comparePassword } from "@/utils/hashing";
import { checkPasswordComplexity } from "@/utils/password-complexity";

import { UserSchema } from "@/server/db/tables/user/schema";

import { loginErrors } from "./errors";
import { errorLogger } from "@/lib/exceptions";

import type { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";
import { getLocale, getTranslations } from "next-intl/server";

const NUMBER_OF_WRONG_ATTEMPTS = env.LOGIN_ATTEMPTS;
const LOCK_TIME_HR = env.LOCK_TIME_HR;
const JWT_VALIDITY_IN_DAYS = env.JWT_VALIDITY_IN_DAYS;
const SECURE = env.NEXT_PUBLIC_VERCEL || env.SSL;

const loginSchema = UserSchema.pick({
  username: true,
  password: true,
}).superRefine((data) => checkPasswordComplexity(data.password));

type LoginFormType = z.infer<typeof loginSchema>;

const loginErrorLog = errorLogger("Login Action Error:");

/**
 * Gets the a date in the future by the number of days
 * At exactly 2:00 AM
 *
 * @param days number of days in the future
 * @param hour (optional) hour in the future
 * @returns date instance in the future
 */
const getDaysInAdvance = (days: number, hour = 2) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const checkAttempts = async ({
  errorMessage,
  attempts,
  userId,
}: {
  errorMessage: string;
  attempts: number;
  userId: number;
}): Promise<string> => {
  const errorMessages = await getTranslations("errors.login");
  // Handle other errors
  if (errorMessage !== "Incorrect Password") {
    return errorMessage;
  }

  // Check if user has too many wrong attempts
  if (attempts < NUMBER_OF_WRONG_ATTEMPTS) {
    const [, incrementError] = await incrementWrongAttempts(userId);
    if (incrementError !== null) {
      loginErrorLog(incrementError);
      return errorMessages("an-error-occurred");
    }
    return errorMessages("incorrect-password");
  }

  // Lock user
  const [, lockError] = await lockUser(userId, LOCK_TIME_HR);
  if (lockError !== null) {
    loginErrorLog(lockError);
    return errorMessages("an-error-occurred");
  }
  return errorMessages("too-many-attempts");
};

export const loginAction = async (
  data: LoginFormType,
  pathname: string,
): Promise<ReturnTuple<number> | undefined> => {
  const errorMessages = await getTranslations("errors.login");

  const timer = new performanceTimer("loginAction");
  timer.start();
  const isValid = loginSchema.safeParse(data);
  if (isValid.error) {
    loginErrorLog(isValid.error);
    return [null, loginErrors.invalidData];
  }

  const [user, error] = await sensitiveGetUserByUsername(data.username);
  if (error !== null) {
    if (error === "User not found")
      return [null, errorMessages("username-does-not-exist")];
    return [null, error];
  }

  if (user.lockedUntil && user.lockedUntil > new Date())
    return [null, errorMessages("account-locked")];

  const [, passwordCheckError] = await comparePassword(
    data.password,
    user.password,
  );
  if (passwordCheckError !== null) {
    const attemptsErrorMessage = await checkAttempts({
      attempts: user.wrongAttempts,
      userId: user.id,
      errorMessage: passwordCheckError,
    });
    return [null, attemptsErrorMessage];
  }

  if (!user.active) return [null, loginErrors.userNotActive];

  const [, updateActiveError] = await updateUserLastActive(user.id);
  if (updateActiveError !== null) loginErrorLog(updateActiveError);

  const expiryDate = getDaysInAdvance(JWT_VALIDITY_IN_DAYS);

  const [token, tokenError] = await createToken(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    expiryDate,
  );
  if (tokenError !== null) return [null, tokenError];

  cookies().set("token", token, {
    httpOnly: true,
    secure: SECURE,
    expires: expiryDate,
    sameSite: "lax",
    priority: "high",
  });
  timer.end();

  const locale = await getLocale();
  redirect({ locale, href: pathname === "/login" ? "/" : pathname });
};

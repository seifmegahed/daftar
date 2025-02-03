"use server";

import { convertUserRequest } from "@/server/db/tables/user-request/mutations";
import { getUserRequest } from "@/server/db/tables/user-request/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { ConvertUserRequestErrorCodes } from "./error-codes";

const codeValidityInDays = 1;

/**
 *
 * Convert the user request code to a user account
 *
 * @param code
 * @returns
 */
export const convertRequestAction = async (
  code: string,
): Promise<ReturnTuple<boolean>> => {
  if (!code) return [null, ConvertUserRequestErrorCodes.InvalidRequest];

  const [request, getRequestError] = await getUserRequest(code);
  if (getRequestError !== null)
    return [null, ConvertUserRequestErrorCodes.InvalidCode];

  if (request.status)
    return [null, ConvertUserRequestErrorCodes.UserAlreadyVerified];

  const now = new Date();
  const expiryDate = new Date(request.createdAt);
  expiryDate.setDate(expiryDate.getDate() + codeValidityInDays);

  if (now.getTime() > expiryDate.getTime()) {
    // Delete the request?
    return [null, ConvertUserRequestErrorCodes.VerificationCodeExpired];
  }

  // Create the user account and update the request status in a single transaction
  const [success, error] = await convertUserRequest(code);
  if (error !== null) return [null, error];

  return [success, null];
};

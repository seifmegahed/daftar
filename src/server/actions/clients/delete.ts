"use server";

import { getCurrentUserAction } from "@/server/actions/users";
import { deleteClient } from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const deleteClientAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, "Unauthorized"];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [client, error] = await deleteClient(clientId);
  if (error !== null) return [null, error];
  return [client, null];
};

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { deleteClient } from "@/server/db/tables/client/mutations";
import { getCurrentUserAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";

export const deleteClientAction = async (
  clientId: number,
): Promise<ReturnTuple<number> | undefined> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, "Unauthorized"];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [, error] = await deleteClient(clientId);
  if (error !== null) return [null, error];
  revalidatePath("clients")
  redirect("/clients");
};

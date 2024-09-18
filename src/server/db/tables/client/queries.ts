import { db } from "@/server/db";
import { type ClientDataType, clientsTable } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";

/**
 * Getters
 */

export type BriefClientType = Pick<
  ClientDataType,
  "id" | "name" | "registrationNumber"
>;

export const getAllClientsBrief = async (): Promise<
  ReturnTuple<BriefClientType[]>
> => {
  try {
    const allClients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        registrationNumber: clientsTable.registrationNumber,
      })
      .from(clientsTable)
      .where(eq(clientsTable.isActive, true))
      .orderBy(asc(clientsTable.id));

    return [allClients, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/**
 * Setters
 */
type SetPartialClient = Pick<
  ClientDataType,
  "name" | "registrationNumber" | "website" | "notes" | "createdBy"
>;

export const insertNewClient = async (
  data: SetPartialClient,
): Promise<ReturnTuple<number>> => {
  try {
    const [client] = await db
      .insert(clientsTable)
      .values(data)
      .returning({ id: clientsTable.id });

    if (!client) throw new Error("Error inserting new client");
    return [client.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Client with name ${data.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

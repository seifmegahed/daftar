import type { z } from "zod";
import { updateItem } from "@/server/db/tables/item/queries";
import { insertItemSchema } from "@/server/db/tables/item/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "@/server/actions/users";

const updateItemNameSchema = insertItemSchema.pick({ name: true });

type UpdateItemNameType = z.infer<typeof updateItemNameSchema>;

export const updateItemNameAction = async (
  itemId: number,
  data: UpdateItemNameType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemNameSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    name: parseData.data.name,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

const updateItemTypeSchema = insertItemSchema.pick({ type: true });

type UpdateItemTypeType = z.infer<typeof updateItemTypeSchema>;

export const updateItemTypeAction = async (
  itemId: number,
  data: UpdateItemTypeType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemTypeSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    type: parseData.data.type,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

const updateItemDescriptionSchema = insertItemSchema.pick({
  description: true,
});

type UpdateItemDescriptionType = z.infer<typeof updateItemDescriptionSchema>;

export const updateItemDescriptionAction = async (
  itemId: number,
  data: UpdateItemDescriptionType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemDescriptionSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    description: parseData.data.description,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

const updateItemMpnSchema = insertItemSchema.pick({ mpn: true });

type UpdateItemMpnType = z.infer<typeof updateItemMpnSchema>;

export const updateItemMpnAction = async (
  itemId: number,
  data: UpdateItemMpnType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemMpnSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    mpn: parseData.data.mpn,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

const updateItemMakeSchema = insertItemSchema.pick({ make: true });

type UpdateItemMakeType = z.infer<typeof updateItemMakeSchema>;

export const updateItemMakeAction = async (
  itemId: number,
  data: UpdateItemMakeType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemMakeSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    make: parseData.data.make,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

const updateItemNotesSchema = insertItemSchema.pick({ notes: true });

type UpdateItemNotesType = z.infer<typeof updateItemNotesSchema>;

export const updateItemNotesAction = async (
  itemId: number,
  data: UpdateItemNotesType,
): Promise<ReturnTuple<number>> => {
  const parseData = updateItemNotesSchema.safeParse(data);
  if (parseData.success === false) return [null, parseData.error.message];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateItem(itemId, {
    notes: parseData.data.notes,
    updatedBy: currentUserId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

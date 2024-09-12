"use server";
import { getAllUsers } from "@/server/db/tables/user/queries";
import { UserSchema } from "@/server/db/tables/user/schema";
import type { z } from "zod";

export const getAllUsersAction = async () => {
  try {
    const allUsers = await getAllUsers();
    return allUsers ?? [];
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

const addUserSchema = UserSchema.pick({
  name: true,
  username: true,
  password: true,
  role: true,
}).partial({
  name: true,
});

type AddUserFormType = z.infer<typeof addUserSchema>;

export const addUser = async (data: AddUserFormType) => {
  const isValid = addUserSchema.safeParse(data);

  if (!isValid.success) {
    throw new Error("Invalid data");
  }

  console.log("Adding user:", data);
};

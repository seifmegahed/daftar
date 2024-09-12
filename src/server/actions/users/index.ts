"use server";
import { getAllUsers, insertNewUser } from "@/server/db/tables/user/queries";
import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
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
  verifyPassword: true,
  role: true,
}).superRefine((data) => {
  if (!checkPasswordComplexity(data.password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    );
  }
  if (data.password !== data.verifyPassword) {
    throw new Error("Passwords don't match");
  }
});

type AddUserFormType = z.infer<typeof addUserSchema>;

export const addUserAction = async (data: AddUserFormType) => {
  const isValid = addUserSchema.safeParse(data);

  if (!isValid.success) {
    throw new Error("Invalid data");
  }

  const userId = await insertNewUser(data);
  return userId;
};

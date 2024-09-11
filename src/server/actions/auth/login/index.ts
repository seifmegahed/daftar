"use server";

import type { LoginFormType } from "@/app/login/schema";


export const loginAction = async (data: LoginFormType) => {
  // get user from db
  // compare hash with password

  // if password is incorrect, return error

  // create session
  // return token and user
};
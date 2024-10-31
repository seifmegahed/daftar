import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";

import { UserSchema } from "@/server/db/tables/user/schema";

export const schema = UserSchema.pick({
  username: true,
  password: true,
}).superRefine((data, context) => {
  if (!checkPasswordComplexity(data.password)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Incorrect password. Password must contain at least one uppercase letter, one lowercase letter, and one number",
      path: ["password"],
    });
  }
});

export type LoginFormType = z.infer<typeof schema>;

export const defaultValues: LoginFormType = {
  username: "",
  password: "",
};

import { z } from "zod";
import { checkPasswordComplexity } from "@/utils/password-complexity";

import { UserSchema } from "@/server/db/tables/user";

export const schema = UserSchema.pick({
  username: true,
  password: true,
  verifyPassword: true,
}).superRefine((data, context) => {
  if (data.password !== data.verifyPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["verifyPassword"],
    });
  }
  if (!checkPasswordComplexity(data.password)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      path: ["password"],
    });
  }
});

export type ChangePasswordFormType = z.infer<typeof schema>;

export const defaultValues: ChangePasswordFormType = {
  username: "",
  password: "",
  verifyPassword: "",
};

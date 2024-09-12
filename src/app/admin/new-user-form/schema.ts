import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";

export const schema = UserSchema.pick({
  username: true,
  password: true,
  verifyPassword: true,
  name: true,
  role: true,
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

export type NewUserFormType = z.infer<typeof schema>;

export const defaultValues: NewUserFormType = {
  username: "",
  password: "",
  verifyPassword: "",
  name: "",
  role: "user",
};

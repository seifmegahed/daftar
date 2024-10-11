import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { checkUsername } from "@/utils/user-name-check";
import { z } from "zod";

export const schema = UserSchema.pick({
  username: true,
  password: true,
  verifyPassword: true,
  name: true,
  role: true,
})
  .required()
  .superRefine((data, context) => {
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
    if (!checkUsername(data.username)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must not contain spaces or Uppercase letters",
        path: ["username"],
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

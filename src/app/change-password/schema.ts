import { z } from "zod";
import { checkPasswordComplexity } from "@/utils/password-complexity";

export const schema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    verifyPassword: z.string(),
  })
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
  });

export type ChangePasswordFormType = z.infer<typeof schema>;

export const defaultValues: ChangePasswordFormType = {
  username: "",
  password: "",
  verifyPassword: "",
};

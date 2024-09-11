import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";

export const loginSchema = z
  .object({
    username: z.string().min(3).max(256),
    password: z.string().min(3).max(256),
  })
  .superRefine((data, context) => {
    if (!checkPasswordComplexity(data.password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Incorrect password. Password must contain at least one uppercase letter, one lowercase letter, and one number",
        path: ["password"],
      });
    }
  });

export type LoginFormType = z.infer<typeof loginSchema>;

export const defaultValues: LoginFormType = {
  username: "",
  password: "",
};

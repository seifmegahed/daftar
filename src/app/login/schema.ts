import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";

export const schema = z
  .object({
    username: z.string().min(5).max(256),
    password: z.string().min(8).max(256),
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

export type LoginFormType = z.infer<typeof schema>;

export const defaultValues: LoginFormType = {
  username: "",
  password: "",
};

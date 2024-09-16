"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";
import { checkPasswordComplexity } from "@/utils/password-complexity";

const schema = z
  .object({
    oldPassword: z.string().min(8).max(64),
    newPassword: z.string().min(8).max(64),
    verifyPassword: z.string().min(8).max(64),
  })
  .superRefine((data, ctx) => {
    if (!checkPasswordComplexity(data.oldPassword)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        path: ["oldPassword"],
      });
    }
    if (!checkPasswordComplexity(data.newPassword)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        path: ["newPassword"],
      });
    }
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords cannot be the same",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.verifyPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["verifyPassword"],
      });
    }
  });

type ChangePasswordFormType = z.infer<typeof schema>;

const defaultValues: ChangePasswordFormType = {
  oldPassword: "",
  newPassword: "",
  verifyPassword: "",
};

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(console.log)}
        className="space-y-8"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Old Password"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your old password to confirm your identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="New Password"
                  autoComplete="new-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your new password. Password must be at least 8 characters
                long and must contain at least one uppercase letter, one
                lowercase letter, and one number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verifyPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Verify Password"
                  autoComplete="confirm-new-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the same password you entered above to verify it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            Update Password
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

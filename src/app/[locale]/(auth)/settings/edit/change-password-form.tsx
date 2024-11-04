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
import { PasswordInput } from "@/components/inputs/password";
import SubmitButton from "@/components/buttons/submit-button";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { userUpdateUserPasswordAction } from "@/server/actions/users";
import { toast } from "sonner";
import { emptyToUndefined } from "@/utils/common";
import { useTranslations } from "next-intl";

function ChangePasswordForm() {
  const t = useTranslations("edit-user.change-password-section");

  const schema = z
    .object({
      oldPassword: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("old-password-required-message") })
          .min(8, { message: t("old-password-min-length", { minLength: 8 }) })
          .max(64, {
            message: t("old-password-max-length", { maxLength: 64 }),
          }),
      ),
      newPassword: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("password-required-message") })
          .min(8, { message: t("password-min-length", { minLength: 8 }) })
          .max(64, { message: t("password-max-length", { maxLength: 64 }) }),
      ),
      verifyPassword: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("verify-password-required-message") })
          .min(8, {
            message: t("verify-password-min-length", { minLength: 8 }),
          })
          .max(64, {
            message: t("verify-password-max-length", { maxLength: 64 }),
          }),
      ),
    })
    .superRefine((data, ctx) => {
      if (!checkPasswordComplexity(data.oldPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("password-not-complex"),
          path: ["oldPassword"],
        });
        return false;
      }
      if (!checkPasswordComplexity(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("password-not-complex"),
          path: ["newPassword"],
        });
        return false;
      }
      if (data.oldPassword === data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("password-match"),
          path: ["newPassword"],
        });
        return false;
      }
      if (data.newPassword !== data.verifyPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["newPassword"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("password-not-match"),
          path: ["verifyPassword"],
        });
        return false;
      }
    });

  type ChangePasswordFormType = z.infer<typeof schema>;

  const defaultValues: ChangePasswordFormType = {
    oldPassword: "",
    newPassword: "",
    verifyPassword: "",
  };

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ChangePasswordFormType) => {
    try {
      const [, error] = await userUpdateUserPasswordAction(data);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("old-password-title")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="old-password" {...field} />
              </FormControl>
              <FormDescription>{t("old-password-description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password-title")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormDescription>{t("new-password-description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verifyPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("verify-password-title")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="confirm-new-password" {...field} />
              </FormControl>
              <FormDescription>
                {t("verify-password-description")}
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
            {t("update")}
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default ChangePasswordForm;

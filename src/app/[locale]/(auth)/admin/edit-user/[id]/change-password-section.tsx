"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { adminUpdateUserPasswordAction } from "@/server/actions/users";

import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";

import { PasswordInput } from "@/components/inputs/password";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";
import { emptyToUndefined } from "@/utils/common";
import { useTranslations } from "next-intl";

function ChangePasswordSection({ userId }: { userId: number }) {
  const t = useTranslations("edit-user.change-password-section");

  const changePasswordSchema = z
    .object({
      password: z.preprocess(
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
    .superRefine(({ password, verifyPassword }, ctx) => {
      if (!checkPasswordComplexity(password)) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: t("password-not-complex"),
        });
        return false;
      }
      if (password !== verifyPassword) {
        ctx.addIssue({
          path: ["verifyPassword"],
          code: z.ZodIssueCode.custom,
          message: t("password-not-match"),
        });
        ctx.addIssue({
          path: ["verifyPassword"],
          code: z.ZodIssueCode.custom,
          message: t("password-not-match"),
        });
        return false;
      }
    });

  type FormSchemaType = z.infer<typeof changePasswordSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const [, error] = await adminUpdateUserPasswordAction({
        id: userId,
        password: data.password,
        verifyPassword: data.verifyPassword,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
      return;
    }
  };

  return (
    <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <LabelWrapper label={t("title")} />
          <FormField
            name="password"
            render={({ field }) => (
              <div className="flex flex-col gap-4">
                <Label htmlFor="new">{t("password-title")}</Label>
                <PasswordInput
                  id="new"
                  autoComplete="new-password"
                  {...field}
                />
                <FormMessage {...field} />
              </div>
            )}
          />
          <FormField
            name="verifyPassword"
            render={({ field }) => (
              <div className="flex flex-col gap-4">
                <Label htmlFor="verify">{t("verify-password-title")}</Label>
                <PasswordInput
                  id="verify"
                  autoComplete="new-password"
                  {...field}
                />
                <FormMessage {...field} />
              </div>
            )}
          />
          <p className="text-xs text-muted-foreground">
            {t("description")}
            <br></br>
            <br></br>
            <strong>{t("note")}</strong>
            <br></br>
            {t("note-revoke")}
            <br></br>
            <br></br>
            {t("note-settings")}
          </p>
          <div className="flex justify-end py-4">
            <SubmitButton
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {t("update")}
            </SubmitButton>
          </div>
        </div>
      </Form>
    </form>
  );
}

export default ChangePasswordSection;

"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreateUserAction } from "@/server/actions/users";

import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { z } from "zod";
import { emptyToUndefined } from "@/utils/common";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { checkUsername } from "@/utils/user-name-check";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/utils/common";
import { userRolesList } from "@/data/lut";
import { PasswordInput } from "@/components/inputs";

function NewUserForm() {
  const locale = useLocale() as Locale;
  const direction = getDirection(locale);
  const t = useTranslations("admin.new-user-page");

  const schema = z
    .object({
      username: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.username-required") })
          .min(4, {
            message: t("schema.username-min-length", { minLength: 4 }),
          })
          .max(64, {
            message: t("schema.username-max-length", { maxLength: 64 }),
          }),
      ),
      password: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.password-required") })
          .min(8, {
            message: t("schema.password-min-length", { minLength: 8 }),
          })
          .max(64, {
            message: t("schema.password-max-length", { maxLength: 64 }),
          }),
      ),
      verifyPassword: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.verify-password-required") })
          .min(8, {
            message: t("schema.verify-password-min-length", { minLength: 8 }),
          })
          .max(64, {
            message: t("schema.verify-password-max-length", { maxLength: 64 }),
          }),
      ),
      name: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.name-required") })
          .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
          .max(64, { message: t("schema.name-max-length", { maxLength: 64 }) }),
      ),
      email: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .email({ message: t("schema.email-not-valid") })
          .max(64, { message: t("schema.email-max-length", { maxLength: 64 }) })
          .optional(),
      ),
      phoneNumber: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(64, {
            message: t("schema.phone-number-max-length", { maxLength: 64 }),
          })
          .optional(),
      ),
      role: z.preprocess(
        emptyToUndefined,
        z.string({ required_error: t("schema.role-required") }),
      ),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.verifyPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("schema.password-not-match"),
          path: ["password"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("schema.password-not-match"),
          path: ["verifyPassword"],
        });
        return false;
      }
      if (!checkPasswordComplexity(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("schema.password-complexity"),
          path: ["password"],
        });
        return false;
      }
      if (!checkUsername(data.username)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("schema.username-not-valid"),
          path: ["username"],
        });
        return false;
      }
    });

  type NewUserFormSchemaType = z.infer<typeof schema>;

  const defaultValues: NewUserFormSchemaType = {
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    verifyPassword: "",
    name: "",
    role: "user",
  };

  const form = useForm<NewUserFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: NewUserFormSchemaType) => {
    try {
      const response = await adminCreateUserAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success(t("form.success"));
    } catch (error) {
      console.log(error);
      toast.error(t("form.error"));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("form.title")}
          description={t("form.description")}
          buttonText={t("form.button-text")}
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="username">
                  {t("form.username-field-label")}
                </Label>
                <Input
                  id="username"
                  type="username"
                  autoComplete="new-username"
                  {...field}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value
                        .toLowerCase()
                        .trim()
                        .replaceAll(" ", ""),
                    )
                  }
                />
                <FormDescription>
                  {t("form.username-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">{t("form.name-field-label")}</Label>
                <Input
                  id="name"
                  type="name"
                  autoComplete="new-name"
                  {...field}
                />
                <FormMessage />
                <FormDescription>
                  {t("form.name-field-description")}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">{t("form.email-field-label")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="new-email"
                  {...field}
                />
                <FormMessage />
                <FormDescription>
                  {t("form.email-field-description")}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="phoneNumber">
                  {t("form.phone-number-field-label")}
                </Label>
                <Input
                  id="phoneNumber"
                  type="phoneNumber"
                  autoComplete="new-phoneNumber"
                  {...field}
                />
                <FormMessage />
                <FormDescription>
                  {t("form.phone-number-field-description")}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <Label htmlFor="role">{t("form.role-field-label")}</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  dir={direction}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userRolesList.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("form.role-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">
                  {t("form.password-field-label")}
                </Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  {...field}
                />
                <FormDescription>
                  {t("form.password-field-description")}
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
                <Label htmlFor="verify-password">
                  {t("form.verify-password-field-label")}
                </Label>
                <PasswordInput
                  id="verify-password"
                  autoComplete="new-password-verify"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewUserForm;

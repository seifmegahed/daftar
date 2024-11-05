"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/server/actions/auth/login";
import { toast } from "sonner";
import { env } from "@/env";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/inputs/password";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";

import { emptyToUndefined } from "@/utils/common";
import { useTranslations } from "next-intl";

function LoginForm() {
  const t = useTranslations("login");

  const schema = z.object({
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
  });

  type LoginFormSchemaType = z.infer<typeof schema>;

  const defaultValues: LoginFormSchemaType = {
    username: "",
    password: "",
  };

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormSchemaType) => {
    try {
      const response = await loginAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success(t("form.success"));
    } catch (error) {
      console.error(error);
      toast.error(t("form.error"));
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background lg:h-full">
      <div className="relative w-full max-w-md overflow-hidden py-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("form.title", { demo: env.NEXT_PUBLIC_VERCEL })}
              </CardTitle>
              <CardDescription>{t("form.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">{t("form.username-title")}</Label>
                    <Input id="username" type="username" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">{t("form.password-title")}</Label>
                    <PasswordInput id="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="mt-5 w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loading className="h-5 w-5" />
                ) : (
                  t("form.button-text")
                )}
              </Button>
            </CardContent>
          </Form>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

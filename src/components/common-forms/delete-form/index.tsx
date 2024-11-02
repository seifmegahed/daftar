"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { emptyToUndefined } from "@/utils/common";
import { toast } from "sonner";

import { useLocale, useTranslations } from "next-intl";
import { getLocaleType } from "@/utils/common";

import type { ReturnTuple } from "@/utils/type-utils";
import type { ReactNode } from "react";
import DeleteFormInfo from "./DeleteFormInfo";

function DeleteForm({
  id,
  name,
  access,
  type,
  disabled = false,
  onDelete,
}: {
  id: number;
  name: string;
  access: boolean;
  disabled?: boolean;
  type: "client" | "project" | "supplier" | "item" | "document";
  formInfo?: ReactNode;
  onDelete: (id: number) => Promise<ReturnTuple<number> | undefined>;
}) {
  const locale = useLocale() as "ar" | "en";
  const localizedType = getLocaleType(type, locale);
  const t = useTranslations("delete-form");

  const schema = z
    .object({
      name: z.preprocess(
        emptyToUndefined,
        z.string({ message: t("required", { type: localizedType }) }),
      ),
    })
    .superRefine((data, ctx) => {
      if (data.name !== name) {
        ctx.addIssue({
          path: ["name"],
          message: t("name-must-match"),
          code: "custom",
        });
        return false;
      }
    });

  type FormDataType = z.infer<typeof schema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (_data: FormDataType) => {
    if (!access || disabled) {
      toast.error(t("unauthorized", { type: localizedType }));
      return;
    }
    try {
      const response = await onDelete(id);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(t("error", { type: localizedType }));
    }
  };

  return (
    <div className="flex flex-col gap-4 scroll-smooth" id="delete">
      <h2 className="text-xl font-bold">{t("title")}</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative">
                <Input
                  {...field}
                  className="relative z-[2]"
                  disabled={!access || disabled}
                  dir="ltr"
                />
                <p className="absolute left-[12.5px] top-0 select-none text-sm text-muted-foreground">
                  {name}
                </p>
                <FormMessage />
                <FormDescription><DeleteFormInfo type={localizedType} /></FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access ||
                disabled
              }
              loading={form.formState.isSubmitting}
              variant="destructive"
            >
              {t("delete")}
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default DeleteForm;

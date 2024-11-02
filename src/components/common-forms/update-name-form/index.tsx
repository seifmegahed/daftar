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
import { emptyToUndefined, getLocaleType } from "@/utils/common";
import { toast } from "sonner";
import type { ReturnTuple } from "@/utils/type-utils";
import { useLocale, useTranslations } from "next-intl";

const schema = z.object({
  name: z.preprocess(
    emptyToUndefined,
    z
      .string({ message: "Name is required" })
      .min(4, { message: "Name must be at least 4 characters long" })
      .max(64, { message: "Name must not exceed 64 characters" }),
  ),
});

type FormDataType = z.infer<typeof schema>;

function NameForm({
  name,
  access,
  ownerId,
  id,
  type,
  updateCallbackAction = () =>
    Promise.resolve([null, "Callback function missing"]),
  updateCallbackActionWithOwner,
}: {
  name: string;
  access: boolean;
  ownerId?: number;
  id: number;
  type: "client" | "supplier" | "project" | "item" | "document" | "user";
  updateCallbackAction?: (
    id: number,
    data: { name: string },
  ) => Promise<ReturnTuple<number>>;
  updateCallbackActionWithOwner?: (
    id: number,
    data: { name: string; ownerId: number },
  ) => Promise<ReturnTuple<number>>;
}) {
  const t = useTranslations("name-form");
  const locale = useLocale() as "ar" | "en";

  const localeType = getLocaleType(type, locale);

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { name },
  });

  const onSubmit = async (data: FormDataType) => {
    if (!access) {
      toast.error(t("unauthorized", { type: localeType }));
      form.reset({ name });
      return;
    }
    try {
      const [, error] =
        ownerId && updateCallbackActionWithOwner
          ? await updateCallbackActionWithOwner(id, {
              name: data.name,
              ownerId,
            })
          : await updateCallbackAction(id, {
              name: data.name,
            });
      if (error !== null) {
        toast.error(error);
      } else {
        toast.success(t("success"));
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
              <FormItem>
                <Input
                  {...field}
                  className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  disabled={!access}
                />
                <FormMessage />
                <FormDescription>
                  {t("description", { type: localeType })}
                  <br />
                  <strong>{t("note")}</strong>
                  {ownerId
                    ? t("note-with-owner", { type: localeType })
                    : t("note-without-owner", { type: localeType })}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access
              }
              loading={form.formState.isSubmitting}
            >
              {t("update")}
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default NameForm;

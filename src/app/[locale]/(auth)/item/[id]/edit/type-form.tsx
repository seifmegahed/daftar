"use client";

import { z } from "zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { emptyToUndefined, getLocaleType } from "@/utils/common";
import { updateItemTypeAction } from "@/server/actions/items/update";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

const TypeForm = ({
  id,
  defaultValue,
  type = "item",
}: {
  id: number;
  defaultValue: string;
  type?: "item";
}) => {
  const locale = useLocale() as Locale;
  const t = useTranslations("type-update-form");
  const localizedType = getLocaleType(type, locale);

  const typeSchema = z.object({
    type: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("type-required-message") })
        .min(4, { message: t("type-min-length-message", { min: 4 }) })
        .max(64, { message: t("type-max-length-message", { max: 64 }) }),
    ),
  });

  type FormDataType = z.infer<typeof typeSchema>;
  const form = useForm<FormDataType>({
    resolver: zodResolver(typeSchema),
    defaultValues: { type: defaultValue },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateItemTypeAction(id, {
        type: data.type,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">{t("title")}</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                {t("description", { type: localizedType })}
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            {t("update")}
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
};

export default TypeForm;

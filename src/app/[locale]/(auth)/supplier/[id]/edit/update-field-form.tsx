"use client";

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
import { z } from "zod";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";
import { emptyToUndefined, getLocaleType } from "@/utils/common";
import { updateSupplierFieldAction } from "@/server/actions/suppliers/update";
import { useLocale, useTranslations } from "next-intl";

const FieldUpdateForm = ({ id, field }: { id: number; field: string }) => {
  const locale = useLocale() as Locale;
  const t = useTranslations("field-update-form");

  const schema = z.object({
    field: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("field-required-message") })
        .min(4, { message: t("field-min-length-message", { minLength: 4 }) })
        .max(64, { message: t("field-max-length-message", { maxLength: 64 }) }),
    ),
  });
  
  type FormDataType = z.infer<typeof schema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { field },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateSupplierFieldAction(id, {
        field,
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
          name="field"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                {t("description", { type: getLocaleType("supplier", locale) })}
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

export default FieldUpdateForm;

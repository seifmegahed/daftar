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
import { Textarea } from "@/components/ui/textarea";
import { notesMaxLength } from "@/data/config";
import { emptyToUndefined } from "@/utils/common";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { getLocaleType } from "@/utils/common";
import type { ReturnTuple } from "@/utils/type-utils";

const schema = z.object({
  notes: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(notesMaxLength, {
        message: `Notes must not exceed ${notesMaxLength} characters`,
      })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof schema>;

function NotesForm({
  id,
  notes,
  type,
  updateCallbackAction,
}: {
  id: number;
  notes: string;
  type: "client" | "supplier" | "project" | "item" | "document";
  updateCallbackAction: (
    id: number,
    data: { notes: string | undefined },
  ) => Promise<ReturnTuple<number>>;
}) {
  const locale = useLocale() as "ar" | "en";
  const localizedType = getLocaleType(type, locale);
  const t = useTranslations("notes-form");
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { notes },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateCallbackAction(id, {
        notes: data.notes,
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
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold">{t("title")}</h2>
      <Separator />
      <Form {...form}>
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Notes"
                className={`resize-none ${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                rows={4}
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
}

export default NotesForm;

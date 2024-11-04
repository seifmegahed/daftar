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
import { emptyToUndefined } from "@/utils/common";
import { useTranslations, useLocale } from "next-intl";
import { getLocaleType } from "@/utils/common";
import type { ReturnTuple } from "@/utils/type-utils";

type WebsiteFormProps = {
  id: number;
  updateWebsiteCallbackAction: (
    id: number,
    data: { website: string | undefined },
  ) => Promise<ReturnTuple<number>>;
  website: string;
  type: "client" | "supplier";
};

const WebsiteForm = ({
  id,
  updateWebsiteCallbackAction,
  website,
  type,
}: WebsiteFormProps) => {
  const locale = useLocale() as Locale;
  const t = useTranslations("website-form");
  const localizedType = getLocaleType(type, locale);

  const websiteSchema = z.object({
    website: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(256, {
          message: t("max-length-message", { maxLength: 256 }),
        })
        .optional(),
    ),
  });

  type FormDataType = z.infer<typeof websiteSchema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(websiteSchema),
    defaultValues: { website },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateWebsiteCallbackAction(id, {
        website: data.website,
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
          name="website"
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

export default WebsiteForm;

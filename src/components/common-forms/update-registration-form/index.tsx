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
import { useTranslations, useLocale } from "next-intl";
import type { ReturnTuple } from "@/utils/type-utils";

type RegistrationNumberFormProps = {
  id: number;
  type: "client" | "supplier";
  updateRegistrationNumberCallbackAction: (
    id: number,
    data: { registrationNumber: string | undefined },
  ) => Promise<ReturnTuple<number>>;
  registrationNumber: string;
};

const RegistrationNumberForm = ({
  id,
  type,
  updateRegistrationNumberCallbackAction,
  registrationNumber,
}: RegistrationNumberFormProps) => {
  const locale = useLocale() as Locale;
  const t = useTranslations("registration-number-form");
  const localizedType = getLocaleType(type, locale);

  const schema = z.object({
    registrationNumber: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(256, {
          message: t("max-length-message", { maxLength: 256 }),
        })
        .optional(),
    ),
  });

  type FormDataType = z.infer<typeof schema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { registrationNumber },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateRegistrationNumberCallbackAction(id, {
        registrationNumber: data.registrationNumber,
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
          name="registrationNumber"
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

export default RegistrationNumberForm;

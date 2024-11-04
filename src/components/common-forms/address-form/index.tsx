"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { addNewAddressAction } from "@/server/actions/addresses";

import ComboSelect from "@/components/combo-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { countries } from "@/lib/countries";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { emptyToUndefined } from "@/utils/common";
import { notesMaxLength } from "@/data/config";
import { useTranslations } from "next-intl";

function NewAddressForm({
  id,
  type,
}: {
  id: number;
  type: "supplier" | "client";
}) {
  const t = useTranslations("address");

  const schema = z.object({
    name: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("schema.name-required") })
        .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
        .max(64, {
          message: t("schema.name-max-length", { maxLength: 64 }),
        }),
    ),
    addressLine: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("schema.address-line-required") })
        .min(5, {
          message: t("schema.address-line-min-length", { minLength: 5 }),
        })
        .max(256, {
          message: t("schema.address-line-max-length", { maxLength: 256 }),
        }),
    ),
    country: z.enum(countries, {
      required_error: t("schema.country-required"),
    }),
    city: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(256, {
          message: t("schema.city-max-length", { maxLength: 256 }),
        })
        .optional(),
    ),
    notes: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(notesMaxLength, {
          message: t("schema.address-notes-max-length", {
            maxLength: notesMaxLength,
          }),
        })
        .optional(),
    ),
  });

  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      addressLine: "",
      country: undefined,
      city: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const ref = type === "supplier" ? { supplierId: id } : { clientId: id };
    try {
      const response = await addNewAddressAction(
        {
          ...data,
          ...ref,
        },
        type,
      );
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.address-name-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.address-name-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.address-line-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.address-line-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.country-label")}</FormLabel>
                <ComboSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  options={countries}
                  selectMessage={t("form.country-select-message")}
                  searchMessage={t("form.country-search-message")}
                  notFoundMessage={t("form.country-not-found-message")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.city-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.city-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.address-notes-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {t("form.address-notes-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewAddressForm;

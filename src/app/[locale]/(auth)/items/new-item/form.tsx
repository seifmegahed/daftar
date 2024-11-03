"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addItemAction } from "@/server/actions/items/create";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { notesMaxLength } from "@/data/config";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { emptyToUndefined } from "@/utils/common";
import { useTranslations } from "next-intl";

function NewItemForm() {
  const t = useTranslations("items.new-item-page");

  const schema = z.object({
    name: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("schema.name-required") })
        .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
        .max(64, { message: t("schema.name-max-length", { maxLength: 64 }) }),
    ),
    type: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("schema.type-required") })
        .max(64, { message: t("schema.type-max-length", { maxLength: 64 }) }),
    ),
    description: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(notesMaxLength, {
          message: t("schema.description-max-length", {
            maxLength: notesMaxLength,
          }),
        })
        .optional(),
    ),
    mpn: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(64, { message: t("schema.mpn-max-length", { maxLength: 64 }) })
        .optional(),
    ),
    make: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(64, { message: t("schema.make-max-length", { maxLength: 64 }) })
        .optional(),
    ),
    notes: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(notesMaxLength, {
          message: t("schema.notes-max-length", { maxLength: notesMaxLength }),
        })
        .optional(),
    ),
  });

  type ItemFormSchemaType = z.infer<typeof schema>;

  const defaultValues: ItemFormSchemaType = {
    name: "",
    type: "",
    description: "",
    mpn: "",
    make: "",
    notes: "",
  };

  const form = useForm<ItemFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ItemFormSchemaType) => {
    try {
      const response = await addItemAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("form.success"));
      form.reset();
    } catch (error) {
      console.error(error);
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
          submitting={form.formState.isSubmitting}
          dirty={form.formState.isDirty}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.name-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.name-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.type-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.type-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.description-field-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={2} />
                </FormControl>
                <FormDescription>
                  {t("form.description-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.make-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.make-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mpn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.mpn-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.mpn-field-description")}
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
                <FormLabel>{t("form.notes-field-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {t("form.notes-field-description")}
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

export default NewItemForm;

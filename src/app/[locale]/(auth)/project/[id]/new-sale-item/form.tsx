"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ComboSelect from "@/components/combo-select-obj";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { currencyOptions } from "@/data/lut";
import { createSaleItemAction } from "@/server/actions/sale-items/create";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { emptyToUndefined } from "@/utils/common";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/utils/common";

function NewSaleItemForm({
  projectId,
  itemsList,
}: {
  projectId: number;
  itemsList: { id: number; name: string }[];
}) {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("project.new-sale-item-page.form");

  const schema = z
    .object({
      itemId: z.number({ message: t("item-required") }),
      price: z.preprocess(
        emptyToUndefined,
        z.string({ message: t("price-required") }),
      ),
      currency: z.number({ message: t("currency-required") }),
      quantity: z.preprocess(
        emptyToUndefined,
        z.string({ message: t("quantity-required") }),
      ),
    })
    .superRefine((data, ctx) => {
      if (isNaN(parseFloat(data.price))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("price-number"),
          path: ["price"],
        });
        return false;
      }
      if (isNaN(parseInt(data.quantity))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("quantity-number"),
          path: ["quantity"],
        });
        return false;
      }
    });

  const defaultValues = {
    itemId: undefined,
    supplierId: undefined,
    price: "",
    currency: undefined,
    quantity: "",
  };

  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await createSaleItemAction({
        projectId,
        itemId: data.itemId,
        price: data.price,
        currency: data.currency,
        quantity: parseInt(data.quantity),
      });
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success("Item added");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding item");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
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
            name="itemId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("item-field-label")}</FormLabel>
                <ComboSelect
                  value={field.value ?? null}
                  onChange={field.onChange}
                  options={itemsList.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  selectMessage={t("item-select-message")}
                  searchMessage={t("item-search-message")}
                  notFoundMessage={t("item-not-found-message")}
                />
                <FormDescription>{t("item-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("price-field-label")}</FormLabel>
                <Input {...field} />
                <FormDescription>
                  {t("price-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currency-field-label")}</FormLabel>
                <Select
                  defaultValue={String(field.value) ?? ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  dir={direction}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem
                        key={currency.value}
                        value={String(currency.value)}
                      >
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("currency-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("quantity-field-label")}</FormLabel>
                <Input {...field} />
                <FormDescription>
                  {t("quantity-field-description")}
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

export default NewSaleItemForm;

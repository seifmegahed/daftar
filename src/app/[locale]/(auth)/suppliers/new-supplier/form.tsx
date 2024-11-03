"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import ComboSelect from "@/components/combo-select";

import { toast } from "sonner";
import { addSupplierAction } from "@/server/actions/suppliers/create";
import { notesMaxLength } from "@/data/config";
import { emptyToUndefined } from "@/utils/common";
import { countries } from "@/lib/countries";
import { Separator } from "@/components/ui/separator";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { useTranslations } from "next-intl";

function NewSupplierForm() {
  const t = useTranslations("suppliers.new-supplier-page");
  const addressT = useTranslations("address");
  const contactT = useTranslations("contact");

  const schema = z
    .object({
      name: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.name-required") })
          .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
          .max(64, { message: t("schema.name-max-length", { maxLength: 64 }) }),
      ),
      field: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.field-required") })
          .min(4, { message: t("schema.field-min-length", { minLength: 4 }) })
          .max(64, {
            message: t("schema.field-max-length", { maxLength: 64 }),
          }),
      ),
      registrationNumber: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(64, {
            message: t("schema.registration-number-max-length", {
              maxLength: 64,
            }),
          })
          .optional(),
      ),
      website: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(256, {
            message: t("schema.website-max-length", { maxLength: 256 }),
          })
          .optional(),
      ),
      notes: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(notesMaxLength, {
            message: t("schema.notes-max-length", {
              maxLength: notesMaxLength,
            }),
          })
          .optional(),
      ),
      // Primary Address
      addressName: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: addressT("schema.name-required") })
          .min(4, {
            message: addressT("schema.name-min-length", { minLength: 4 }),
          })
          .max(64, {
            message: addressT("schema.name-max-length", { maxLength: 64 }),
          }),
      ),
      addressLine: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: addressT("schema.address-line-required") })
          .min(5, {
            message: addressT("schema.address-line-min-length", {
              minLength: 5,
            }),
          })
          .max(256, {
            message: addressT("schema.address-line-max-length", {
              maxLength: 256,
            }),
          }),
      ),
      country: z.enum(countries, {
        required_error: addressT("schema.country-required"),
      }),
      city: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(256, {
            message: addressT("schema.city-max-length", { maxLength: 256 }),
          })
          .optional(),
      ),
      addressNotes: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(notesMaxLength, {
            message: addressT("schema.address-notes-max-length", {
              maxLength: notesMaxLength,
            }),
          })
          .optional(),
      ),
      // Primary Contact
      contactName: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: contactT("schema.name-required") })
          .min(4, {
            message: contactT("schema.name-min-length", { minLength: 4 }),
          })
          .max(64, {
            message: contactT("schema.name-max-length", { maxLength: 64 }),
          }),
      ),
      phoneNumber: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(64, {
            message: contactT("schema.phone-number-max-length", {
              maxLength: 64,
            }),
          })
          .optional(),
      ),
      email: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .email({ message: contactT("schema.email-not-valid") })
          .max(64, {
            message: contactT("schema.email-max-length", { maxLength: 64 }),
          })
          .optional(),
      ),
      contactNotes: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .max(notesMaxLength, {
            message: contactT("schema.notes-max-length", {
              maxLength: notesMaxLength,
            }),
          })
          .optional(),
      ),
    })
    .superRefine((data, ctx) => {
      if (!data.email && !data.phoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: contactT("schema.email-or-phone-required"),
          path: ["email"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: contactT("schema.email-or-phone-required"),
          path: ["phoneNumber"],
        });
        return false;
      }
    });

  type SupplierFormSchemaType = z.infer<typeof schema>;

  const defaultValues = {
    name: "",
    field: "",
    registrationNumber: "",
    website: "",
    notes: "",

    addressName: "",
    addressLine: "",
    country: undefined,
    city: "",
    addressNotes: "",

    contactName: "",
    email: "",
    phoneNumber: "",
    contactNotes: "",
  };

  const form = useForm<SupplierFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: SupplierFormSchemaType) => {
    try {
      const response = await addSupplierAction(
        {
          name: data.name,
          field: data.field,
          registrationNumber: data.registrationNumber,
          website: data.website,
          notes: data.notes,
        },
        {
          name: data.addressName,
          addressLine: data.addressLine,
          country: data.country,
          city: data.city,
          notes: data.addressNotes,
        },
        {
          name: data.contactName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          notes: data.contactNotes,
        },
      );
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
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
                <FormLabel>{t("name-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{t("name-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("field-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("field-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("registration-number-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("registration-number-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("website-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("website-field-description")}
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
                <FormLabel>{t("notes-field-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {t("notes-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {addressT("form.primary-address-title")}
            </h2>
            <Separator />
          </div>
          <FormField
            control={form.control}
            name="addressName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{addressT("form.address-name-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {addressT("form.address-name-description")}
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
                <FormLabel>{addressT("form.address-line-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {addressT("form.address-line-description")}
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
                <FormLabel>{addressT("form.country-label")}</FormLabel>
                <ComboSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  options={countries}
                  selectMessage={addressT("form.country-select-message")}
                  searchMessage={addressT("form.country-search-message")}
                  notFoundMessage={addressT("form.country-not-found-message")}
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
                <FormLabel>{addressT("form.city-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {addressT("form.city-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{addressT("form.address-notes-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {addressT("form.address-notes-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {contactT("form.primary-contact-label")}
            </h2>
            <Separator />
          </div>
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactT("form.contact-name-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {contactT("form.contact-name-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactT("form.email-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {contactT("form.email-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactT("form.phone-number-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {contactT("form.phone-number-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactT("form.notes-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {contactT("form.notes-description")}
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

export default NewSupplierForm;

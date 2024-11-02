"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/routing";

import {
  getStorageValues,
  setStorageValues,
  createFormData,
  getFileName,
  createLink,
  refinedSchema,
} from "./utils";
import { toast } from "sonner";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { Input } from "@/components/ui/input";

import { useTranslations } from "next-intl";

import type { FormSchemaType } from "./utils";

function GenerateOfferForm({ projectId }: { projectId: number }) {
  const t = useTranslations("project.commercial-offer.form");

  const navigate = useRouter();
  const storage = typeof window !== "undefined" ? localStorage : null;

  const defaultValues = getStorageValues(storage);

  const schema = refinedSchema({
    offerValidityInDays: t("schema.offer-validity-number"),
    advancePercentage: t("schema.payment-advance-number"),
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    setStorageValues(storage, data);
    try {
      const response = await fetch("/api/generate-commercial-offer", {
        method: "POST",
        body: createFormData({ data, projectId }),
      });
      const filename = getFileName(response);
      if (!filename) {
        toast.error(t("error"));
        return;
      }
      const blob = await response.blob();
      createLink(document, blob, filename);
      navigate.replace("documents");
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
          submitting={form.formState.isSubmitting}
          dirty={true}
        >
          <FormField
            name="companyName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("company-name")}</FormLabel>
                <Input {...field} placeholder="ACME INC" />
                <FormDescription>
                  {t("company-name-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("address")}</FormLabel>
                <Input {...field} placeholder="51 Rosetta st." />
                <FormDescription>{t("address-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyCountry"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("country")}</FormLabel>
                <Input {...field} placeholder="Alexandria, Egypt" />
                <FormDescription>{t("country-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyPhoneNmA"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone-nm-a")}</FormLabel>
                <Input {...field} placeholder="+20 123 456 7890" />
                <FormDescription>
                  {t("phone-nm-a-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyPhoneNmB"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone-nm-b")}</FormLabel>
                <Input {...field} placeholder="+20 123 456 7890" />
                <FormDescription>
                 {t("phone-nm-b-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <Input {...field} placeholder="info@acme-inc.com" />
                <FormDescription>
                  {t("email-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="offerValidityInDays"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("offer-validity-in-days")}</FormLabel>
                <Input {...field} placeholder="7" />
                <FormDescription>
                  {t("offer-validity-in-days-description")}
                  <br />
                  {t("offer-validity-example")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="advancePercentage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("payment-advance")}</FormLabel>
                <Input {...field} placeholder="25" />
                <FormDescription>
                  {t("payment-advance-description")}
                  <br />
                  {t("payment-advance-example")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="deliveryPeriod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("delivery-period")}</FormLabel>
                <Input {...field} placeholder="2 - 3 months" />
                <FormDescription>
                  {t("delivery-period-description")}
                  <br />
                  {t("delivery-period-example")}
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

export default GenerateOfferForm;

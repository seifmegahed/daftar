"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";

import type { GetProjectType } from "@/server/db/tables/project/queries";
import { emptyToUndefined } from "@/utils/common";
import { Input } from "@/components/ui/input";

type GenerateOfferFormProps = {
  project: GetProjectType;
  saleItems: Array<{ name: string; quantity: number; price: string }>;
};

const schema = z
  .object({
    companyName: z.preprocess(emptyToUndefined, z.string()),
    companyAddress: z.preprocess(emptyToUndefined, z.string()),
    companyCountry: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmA: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmB: z.preprocess(emptyToUndefined, z.string()),
    offerValidityInDays: z.preprocess(emptyToUndefined, z.string()),
    advancePercentage: z.preprocess(emptyToUndefined, z.string()),
    deliveryPeriod: z.preprocess(emptyToUndefined, z.string()),
  })
  .superRefine((data, ctx) => {
    const { offerValidityInDays, advancePercentage } = data;
    if (isNaN(parseInt(offerValidityInDays))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Offer Validity must be a number",
        path: ["offerValidityInDays"],
      });
      return false;
    }
    if (isNaN(parseInt(advancePercentage))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Advance Percentage must be a number",
        path: ["advancePercentage"],
      });
      return false;
    }
    return true;
  });

type FormSchemaType = z.infer<typeof schema>;

function GenerateOfferForm({}: GenerateOfferFormProps) {
  const defaultValues = {
    companyName: localStorage.getItem("companyName") ?? "",
    companyAddress: localStorage.getItem("companyAddress") ?? "",
    companyCountry: localStorage.getItem("companyCountry") ?? "",
    companyPhoneNmA: localStorage.getItem("companyPhoneNmA") ?? "",
    companyPhoneNmB: localStorage.getItem("companyPhoneNmB") ?? "",
    offerValidityInDays: localStorage.getItem("offerValidityInDays") ?? "",
    advancePercentage: localStorage.getItem("advancePercentage") ?? "",
    deliveryPeriod: localStorage.getItem("deliveryPeriod") ?? "",
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    localStorage.setItem("companyName", data.companyName);
    localStorage.setItem("companyAddress", data.companyAddress);
    localStorage.setItem("companyCountry", data.companyCountry);
    localStorage.setItem("companyPhoneNmA", data.companyPhoneNmA);
    localStorage.setItem("companyPhoneNmB", data.companyPhoneNmB);
    localStorage.setItem("offerValidityInDays", data.offerValidityInDays);
    localStorage.setItem("advancePercentage", data.advancePercentage);
    localStorage.setItem("deliveryPeriod", data.deliveryPeriod);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Commercial Offer"
          description="Generate a commercial offer document for the project"
          buttonText="Generate"
          submitting={form.formState.isSubmitting}
          dirty={true}
        >
          <FormField
            name="companyName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <Input {...field} placeholder="ACME INC" />
                <FormDescription>
                  Enter the name of your company. This name will be displayed on
                  the commercial offer document.
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
                <FormLabel>Address *</FormLabel>
                <Input {...field} placeholder="51 Rosetta st." />
                <FormDescription>
                  Enter the address of your company. This address will be
                  displayed on the commercial offer document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyCountry"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <Input {...field} placeholder="Alexandria, Egypt" />
                <FormDescription>
                  Enter the city and country of your company. This is the
                  country you will be displayed on the commercial offer
                  document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyPhoneNmA"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Primary) *</FormLabel>
                <Input {...field} placeholder="+20 123 456 7890" />
                <FormDescription>
                  Enter the primary phone number of your company. This is the
                  phone number will be displayed on the commercial offer
                  document.
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
                <FormLabel>Phone Number (Secondary) *</FormLabel>
                <Input {...field} placeholder="+20 123 456 7890" />
                <FormDescription>
                  Enter the secondary phone number of your company. This is the
                  phone number will be displayed on the commercial offer
                  document.
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
                <FormLabel>Offer Validity (in days) *</FormLabel>
                <Input {...field} placeholder="7" />
                <FormDescription>
                  Enter the number of days the offer is valid for. This will be
                  displayed on the commercial offer document terms.
                  <br />
                  Example: 7
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
                <FormLabel>Payment Advance (%) *</FormLabel>
                <Input {...field} placeholder="25" />
                <FormDescription>
                  Enter the percentage of the advance payment. This will be
                  displayed on the commercial offer document terms.
                  <br />
                  Example: 25%
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
                <FormLabel>Delivery Period</FormLabel>
                <Input {...field} placeholder="2 - 3 months" />
                <FormDescription>
                  Enter the delivery period of the project. This will be
                  displayed on the commercial offer document terms.
                  <br />
                  Example: 2 - 3 months
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

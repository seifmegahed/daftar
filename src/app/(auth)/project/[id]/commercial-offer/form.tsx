"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
import { useRouter } from "next/navigation";

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

import { emptyToUndefined } from "@/utils/common";
import { toast } from "sonner";

// import type { GetProjectType } from "@/server/db/tables/project/queries";

type GenerateOfferFormProps = {
  // project: GetProjectType;
  // saleItems: Array<{ name: string; quantity: number; price: string }>;
  projectId: number;
};

const schema = z
  .object({
    companyName: z.preprocess(emptyToUndefined, z.string()),
    companyAddress: z.preprocess(emptyToUndefined, z.string()),
    companyCountry: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmA: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmB: z.preprocess(emptyToUndefined, z.string()),
    companyEmail: z.preprocess(emptyToUndefined, z.string().email()),
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

const createFormData = (values: {
  data: FormSchemaType;
  projectId: number;
}) => {
  const { data, projectId } = values;
  const formData = new FormData();
  formData.append("id", projectId.toString());
  formData.append("companyName", data.companyName);
  formData.append("companyAddress", data.companyAddress);
  formData.append("companyCountry", data.companyCountry);
  formData.append("companyPhoneNmA", data.companyPhoneNmA);
  formData.append("companyPhoneNmB", data.companyPhoneNmB);
  formData.append("companyEmail", data.companyEmail);
  formData.append("offerValidityInDays", data.offerValidityInDays);
  formData.append("advancePercentage", data.advancePercentage);
  formData.append("deliveryPeriod", data.deliveryPeriod);
  return formData;
};

function GenerateOfferForm({ projectId }: GenerateOfferFormProps) {
  const storage = typeof window !== "undefined" ? localStorage : null;
  // const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const defaultValues = {
    companyName: storage?.getItem("companyName") ?? "",
    companyAddress: storage?.getItem("companyAddress") ?? "",
    companyCountry: storage?.getItem("companyCountry") ?? "",
    companyPhoneNmA: storage?.getItem("companyPhoneNmA") ?? "",
    companyPhoneNmB: storage?.getItem("companyPhoneNmB") ?? "",
    companyEmail: storage?.getItem("companyEmail") ?? "",
    offerValidityInDays: storage?.getItem("offerValidityInDays") ?? "",
    advancePercentage: storage?.getItem("advancePercentage") ?? "",
    deliveryPeriod: storage?.getItem("deliveryPeriod") ?? "",
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const setStorage = (data: FormSchemaType) => {
    storage?.setItem("companyName", data.companyName);
    storage?.setItem("companyAddress", data.companyAddress);
    storage?.setItem("companyCountry", data.companyCountry);
    storage?.setItem("companyPhoneNmA", data.companyPhoneNmA);
    storage?.setItem("companyPhoneNmB", data.companyPhoneNmB);
    storage?.setItem("companyEmail", data.companyEmail);
    storage?.setItem("offerValidityInDays", data.offerValidityInDays);
    storage?.setItem("advancePercentage", data.advancePercentage);
    storage?.setItem("deliveryPeriod", data.deliveryPeriod);
  };

  const onSubmit = async (data: FormSchemaType) => {
    setStorage(data);
    try {
      const formData = createFormData({ data, projectId });
      await fetch("/api/generate-commercial-offer", {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        const filename = response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.slice(1);
        if (filename) {
          const link = document.createElement("a");
          const blob = await response.blob();
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          link.remove();
          navigate.replace("documents");
        } else {
          toast.error("An error occurred while generating the file");
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating the file");
    }
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
            name="companyEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <Input {...field} placeholder="info@acme-inc.com" />
                <FormDescription>
                  Enter the email address of your company. This email will be
                  displayed on the commercial offer document.
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
                  Example: 25
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

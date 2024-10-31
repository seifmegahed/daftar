"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  schema,
  getStorageValues,
  setStorageValues,
  createFormData,
  getFileName,
  createLink,
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

import type { FormSchemaType } from "./utils";

function GenerateOfferForm({ projectId }: { projectId: number }) {
  const navigate = useRouter();
  const storage = typeof window !== "undefined" ? localStorage : null;

  const defaultValues = getStorageValues(storage);

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
        toast.error("An error occurred while generating the file");
        return;
      }
      const blob = await response.blob();
      createLink(document, blob, filename);
      navigate.replace("documents");
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

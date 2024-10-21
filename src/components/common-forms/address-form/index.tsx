"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { addNewAddressAction } from "@/server/actions/addresses";

import ComboSelect from "@/components/combo-select";
import {
  Form,
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
import { notesFormSchema } from "@/utils/schemas";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  addressLine: z.preprocess(
    emptyToUndefined,
    z.string().max(256, {
      message: "Address line must not be longer than 256 characters",
    }),
  ),
  country: z.enum(countries, { message: "Country is required" }),
  city: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(64, { message: "City must not be longer than 64 characters" })
      .optional(),
  ),
  notes: notesFormSchema,
});

type FormSchemaType = z.infer<typeof formSchema>;

function NewAddressForm({
  id,
  type,
}: {
  id: number;
  type: "supplier" | "client";
}) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
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
      toast.success("Address added");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the address");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Add Address"
          description="Enter the details of the address you want to add."
          buttonText="Add Address"
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <Input {...field} data-testid="title" />
                <FormDescription>
                  Title of the address, e.g. Main Office, Warehouse, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address *</FormLabel>
                <Input {...field} data-testid="address-line" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <ComboSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  options={countries}
                  selectMessage="Select a country"
                  searchMessage="Search for a country"
                  notFoundMessage="Country not found"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  {...field}
                  rows={3}
                  className="resize-none"
                  data-testid="notes-field"
                />
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

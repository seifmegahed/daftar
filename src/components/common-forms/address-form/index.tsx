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
import SubmitButton from "@/components/buttons/submit-button";

import { countries } from "@/lib/countries";
import { notesMaxLength } from "@/data/config";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  addressLine: z
    .string()
    .min(1, { message: "Address line is required" })
    .max(256, {
      message: "Address line must not be longer than 256 characters",
    }),
  country: z.enum(countries, { message: "Country is required" }),
  city: z
    .string()
    .max(64, { message: "City must not be longer than 64 characters" }),
  notes: z.string().max(notesMaxLength, {
    message: `Notes must not be longer than ${notesMaxLength} characters`,
  }),
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
    const [, addressInsertError] = await addNewAddressAction({
      ...data,
      ...ref,
    });
    if (addressInsertError !== null) {
      toast.error("An error occurred while adding the address");
    } else {
      toast.success("Address added successfully");
      form.reset();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <h2 className="text-2xl font-bold">Address Form</h2>
        <Separator />
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
              <FormLabel>Address Line</FormLabel>
              <Input {...field} data-testid="address-line" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="country"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between py-2">
                <FormLabel>Country</FormLabel>
                <ComboSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  options={countries}
                  selectMessage="Select a country"
                  searchMessage="Search for a country"
                  notFoundMessage="Country not found"
                />
              </div>
              <div className="flex justify-end">
                <FormMessage />
              </div>
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
        <div className="flex justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
            data-testid="submit-button"
          >
            Add Address
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewAddressForm;

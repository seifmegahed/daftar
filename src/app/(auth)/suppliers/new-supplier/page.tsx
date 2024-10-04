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
import SubmitButton from "@/components/buttons/submit-button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { addSupplierAction } from "@/server/actions/suppliers/create";
import { getErrorMessage } from "@/lib/exceptions";
import { notesMaxLength } from "@/data/config";
import { emptyToUndefined } from "@/utils/common";
import { countries } from "@/lib/countries";
import { Separator } from "@/components/ui/separator";
import ComboSelect from "@/components/combo-select";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  field: z
    .string({ required_error: "Field is required" })
    .min(4, { message: "Field must be at least 4 characters" })
    .max(64, { message: "Field must not be longer than 64 characters" }),
  registrationNumber: z.string().max(64, {
    message: "Registration number must not be longer than 64 characters",
  }),
  website: z
    .string()
    .max(256, { message: "Website must not be longer than 256 characters" }),
  notes: z.string().max(notesMaxLength, {
    message: `Notes must not be longer than ${notesMaxLength} characters`,
  }),

  // Primary Address
  addressName: z
    .string()
    .min(4, { message: "Address name is required" })
    .max(64, { message: "Address Name must not be longer than 64 characters" }),
  addressLine: z
    .string()
    .min(1, { message: "Address line is required" })
    .max(256, {
      message: "Address Line must not be longer than 256 characters",
    }),
  country: z.enum(countries, { message: "Country is required" }),
  city: z
    .string()
    .max(64, { message: "City must not be longer than 64 characters" }),
  addressNotes: z.string().max(notesMaxLength, {
    message: `Address notes must not be longer than ${notesMaxLength} characters`,
  }),
  // Primary Contact
  contactName: z
    .string()
    .min(4, { message: "Contact name is required" })
    .max(64, { message: "Contact name must not be longer than 64 characters" }),
  phoneNumber: z
    .string()
    .max(64, { message: "Phone number must not be longer than 64 characters" }),
  email: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .email({ message: "Email is not valid" })
      .max(64, { message: "Email must not be longer than 64 characters" })
      .optional(),
  ),
  contactNotes: z.string().max(notesMaxLength, {
    message: `Contact notes must not be longer than ${notesMaxLength} characters`,
  }),
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

function NewSupplierForm() {
  const form = useForm<SupplierFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: SupplierFormSchemaType) => {
    try {
      const [, error] = await addSupplierAction(
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
      if (error !== null) return toast.error(error);
      toast.success("Supplier added successfully");
      form.reset();
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <h2 className="text-2xl font-bold">Supplier Form</h2>
        <Separator />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the supplier. This is the name you will be
                using to search and refer to the supplier. It will appear in
                your projects.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field of Business</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the supplier&apos;s field of business. This will be used
                to categorize the supplier and make it easier to search for
                them.
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
              <FormLabel>Registration Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the registration number of the supplier.
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
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the website of the supplier.
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" rows={4} />
              </FormControl>
              <FormDescription>
                Enter any notes about the supplier.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <h2 className="text-xl font-bold">Primary Address</h2>
        <Separator />
        <FormField
          control={form.control}
          name="addressName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the supplier&apos;s address. This will be the
                primary address of the supplier. It will appear in your
                projects. You can add additional addresses for the supplier. You
                can also assign another address as the supplier&apos;s primary
                address later.
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
              <FormLabel>Address Line</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the address line of the address.
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
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter the city of the address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" rows={4} />
              </FormControl>
              <FormDescription>
                Enter any notes about the address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <h2 className="text-xl font-bold">Primary Contact</h2>
        <Separator />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the contact. This is the name you will be
                using to search and refer to the contact. This will be the
                primary contact of the supplier. It will appear in your
                projects. You can add additional contacts for the supplier. You
                can also assign another contact as the supplier&apos;s primary
                contact later.
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the email address of the contact.
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the phone number of the contact.
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" rows={4} />
              </FormControl>
              <FormDescription>
                Enter any notes about the contact.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            Save
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewSupplierForm;

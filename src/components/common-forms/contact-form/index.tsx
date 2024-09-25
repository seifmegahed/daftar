"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { addNewContactAction } from "@/server/actions/contacts";
import { emptyToUndefined } from "@/utils/common";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/buttons/submit-button";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
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
  notes: z
    .string()
    .max(256, { message: "Notes must not be longer than 256 characters" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

function NewContactForm({
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
      phoneNumber: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const ref = type === "supplier" ? { supplierId: id } : { clientId: id };
    try {
      const [, contactInsertError] = await addNewContactAction({
        ...data,
        ...ref,
        createdBy: -1,
      });
      if (contactInsertError !== null) {
        toast.error("An error occurred while adding the contact");
      } else {
        toast.success("Contact added successfully");
        form.reset();
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("An error occurred while adding the contact");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">Contact Form</h1>
      <Form {...form}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <Textarea {...field} rows={3} className="resize-none" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
          >
            Add Contact
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewContactForm;

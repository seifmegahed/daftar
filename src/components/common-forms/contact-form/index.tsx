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
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { notesFormSchema } from "@/utils/schemas";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  phoneNumber: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(64, {
        message: "Phone number must not be longer than 64 characters",
      })
      .optional(),
  ),
  email: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .email({ message: "Email is not valid" })
      .max(64, { message: "Email must not be longer than 64 characters" })
      .optional(),
  ),
  notes: notesFormSchema,
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
      const response = await addNewContactAction(
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
      toast.success("Contact Added");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the contact");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Add Contact"
          description="Enter the details of the contact you want to add."
          buttonText="Add Contact"
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
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
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewContactForm;

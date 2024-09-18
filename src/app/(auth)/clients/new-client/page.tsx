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
import { addClientAction } from "@/server/actions/clients";
import { getErrorMessage } from "@/lib/exceptions";

const schema = z.object({
  name: z.string({ required_error: "Name is required" }).min(4).max(64),
  registrationNumber: z.string().max(64),
  website: z.string().max(256),
  notes: z.string().max(256),
});

type ClientFormSchemaType = z.infer<typeof schema>;

const defaultValues: ClientFormSchemaType = {
  name: "",
  registrationNumber: "",
  website: "",
  notes: "",
};

function NewClientPage() {
  const form = useForm<ClientFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ClientFormSchemaType) => {
    try {
      const [result, error] = await addClientAction(data);
      if (error !== null) return toast.error(error);
      toast.success(`Client ID: ${result}`);
      form.reset();
    } catch (error) {
      console.error("Error adding client:", error);
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
                Enter the name of the client. This is the name you will be using
                to search and refer to the client. It will appear in your
                projects.
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
                Enter the registration number of the client.
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
                Enter the website of the client.
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
                Enter any notes about the client.
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

export default NewClientPage;

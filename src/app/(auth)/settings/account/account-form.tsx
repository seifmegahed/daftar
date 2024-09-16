"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(64, {
      message: "Name must not be longer than 64 characters.",
    }),
});

/**
 *
 * View avatar and edit name
 *
 * Change password form with old password and new password and confirm new password fields
 *
 */

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: "",
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
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
            Update Name
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

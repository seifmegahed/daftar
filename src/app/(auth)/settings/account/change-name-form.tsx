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
import { userUpdateUserDisplayNameAction } from "@/server/actions/users";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/exceptions";

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

function ChangeNameForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AccountFormValues) => {
    try {
      const [, error] = await userUpdateUserDisplayNameAction(data);
      if (error !== null) return toast.error(error);
      toast.success(`Display name updated`);
      form.reset();
    } catch (error) {
      console.error("Error updating user name:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                This is the name that will be displayed in the application and
                will be used to generate your avatar.
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

export default ChangeNameForm;
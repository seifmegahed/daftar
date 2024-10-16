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

function ChangeNameForm({ name }: { name: string }) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { name },
  });

  const onSubmit = async (data: AccountFormValues) => {
    try {
      const [, error] = await userUpdateUserDisplayNameAction(data);
      if (error !== null) {
        toast.error(error);
        return;
      };
      toast.success("Name updated");
      form.reset(data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating name");
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
                <Input
                  {...field}
                  className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                />
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

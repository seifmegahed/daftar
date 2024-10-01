"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { notesMaxLength } from "@/data/config";
import { emptyToUndefined } from "@/utils/common";

const schema = z.object({
  description: z.preprocess(
    emptyToUndefined,

    z
      .string({ message: "Description is required" })
      .min(4, { message: "Description must be at least 4 characters long" })
      .max(notesMaxLength, {
        message: `Description must not exceed ${notesMaxLength} characters`,
      }),
  ),
});

type FormDataType = z.infer<typeof schema>;

function DescriptionForm({ description }: { description: string }) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { description },
  });

  const onSubmit = async (data: FormDataType) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    form.reset(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Description</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Textarea
                  {...field}
                  className={`resize-none ${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  rows={4}
                />
                <FormMessage />
                <FormDescription>
                  Update project description, this will change the description
                  of the project across all references. After typing the updated
                  description press the update button to persist the change.
                  Project description is one of the fields used to search
                  projects.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              loading={form.formState.isSubmitting}
            >
              Update
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default DescriptionForm;

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
import { toast } from "sonner";

import type { ReturnTuple } from "@/utils/type-utils";

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

function DescriptionForm({
  id,
  description,
  type,
  updateCallbackAction,
}: {
  id: number;
  description: string;
  type: "client" | "supplier" | "project" | "item";
  updateCallbackAction: (
    id: number,
    data: { description: string | undefined },
  ) => Promise<ReturnTuple<number>>;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { description },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateCallbackAction(id, {
        description: data.description,
      });
      if (error !== null) {
        console.log(error);
        toast.error(error);
        return;
      }
      toast.success("Description updated");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating description");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Description</h2>
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
                  {`Update ${type} description, this will change the description
                  of the ${type} across all references. After typing the updated
                  description press the update button to persist the change.
                  The ${type} description is one of the fields used to search
                  ${type}s.`}
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

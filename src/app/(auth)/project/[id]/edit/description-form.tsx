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
import { updateProjectDescriptionAction } from "@/server/actions/projects";

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
  projectId,
  description,
}: {
  projectId: number;
  description: string;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { description },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateProjectDescriptionAction(projectId, {
        description: data.description,
      });
      if (error !== null) {
        console.log(error);
        toast.error("Error updating project description");
      } else {
        toast.success("Project description updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating project description");
    }
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

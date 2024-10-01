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
import { updateProjectNotesAction } from "@/server/actions/projects";

const schema = z.object({
  notes: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(notesMaxLength, {
        message: `Notes must not exceed ${notesMaxLength} characters`,
      })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof schema>;

function NotesForm({ projectId, notes }: { projectId: number, notes: string }) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { notes },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateProjectNotesAction(projectId, {
        notes: data.notes,
      });
      if (error !== null) {
        console.log(error);
        toast.error("Error updating project notes");
      } else {
        toast.success("Project notes updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating project notes");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Notes</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Notes"
                  className={`resize-none ${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  rows={4}
                />
                <FormMessage />
                <FormDescription>
                  Update project notes, this will change the notes of the
                  project across all references and the previous notes will be
                  lost. After typing the updated description press the update
                  button to persist the change.
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

export default NotesForm;

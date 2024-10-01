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
import { Input } from "@/components/ui/input";
import { emptyToUndefined } from "@/utils/common";
import { toast } from "sonner";
import { updateProjectNameAction } from "@/server/actions/projects";

const schema = z.object({
  name: z.preprocess(
    emptyToUndefined,
    z
      .string({ message: "Name is required" })
      .min(4, { message: "Name must be at least 4 characters long" })
      .max(64, { message: "Name must not exceed 64 characters" }),
  ),
});

type FormDataType = z.infer<typeof schema>;

function NameForm({
  name,
  access,
  ownerId,
  projectId,
}: {
  name: string;
  access: boolean;
  ownerId: number;
  projectId: number;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { name },
  });

  const onSubmit = async (data: FormDataType) => {
    if(!access) {
      toast.error("You do not have permission to change the project name");
      form.reset({ name });
      return;
    }
    try {
      const [, error] = await updateProjectNameAction(projectId, {
        name: data.name,
        ownerId,
      });
      if (error !== null) {
        console.log(error);
        toast.error("Error updating project name");
      } else {
        toast.success("Project name updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating project name");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Name</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  disabled={!access}
                />
                <FormMessage />
                <FormDescription>
                  Update project name, this will change the name of the project
                  across all references. After typing the updated name press the
                  update button to persist the change. Project name is one of
                  the fields used to search project. Project name must be
                  unique.
                  <br />
                  <strong>Note:</strong> Only the owner or an admin can change
                  the project name.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access
              }
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

export default NameForm;

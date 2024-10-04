"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { statusCodes } from "@/data/lut";
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
import { toast } from "sonner";
import { updateProjectStatusAction } from "@/server/actions/projects/update";

const schema = z.object({
  status: z.preprocess((value: unknown) => Number(value), z.number()),
});

type FormDataType = z.infer<typeof schema>;

function StatusForm({
  status,
  projectId,
}: {
  status: number;
  projectId: number;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { status },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateProjectStatusAction(projectId, data);
      if (error !== null) {
        console.log(error);
        toast.error("Error updating project status");
      } else {
        toast.success("Project status updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating project status");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Status</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={String(status)}
                  value={String(field.value)}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusCodes
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((code) => (
                        <SelectItem key={code.value} value={String(code.value)}>
                          {code.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>
                  Update project status to reflect the current state of the
                  project. After selecting the desired state press the update
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

export default StatusForm;

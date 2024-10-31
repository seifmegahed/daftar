"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";
import { updateProjectDatesAction } from "@/server/actions/projects/update";
import { toast } from "sonner";
import { useState } from "react";
import { toDBDate } from "@/utils/common";

const schema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FormDataType = z.infer<typeof schema>;

function DatesForm({
  startDate,
  endDate,
  projectId,
}: {
  startDate?: Date;
  endDate?: Date;
  projectId: number;
}) {
  const [defaultValues, setDefaultValues] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({ startDate, endDate });
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateProjectDatesAction(projectId, {
        startDate: toDBDate(data.startDate),
        endDate: toDBDate(data.endDate),
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Project dates updated");
      setDefaultValues(data);
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating dates");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Dates</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Start Date</FormLabel>
                  <div className="flex flex-col gap-2">
                    <DatePicker
                      onChange={(value) => field.onChange(value ?? undefined)}
                      date={field.value}
                      className={`${field.value?.toString() !== defaultValues.startDate?.toString() ? "" : "!text-muted-foreground"}`}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>End Date</FormLabel>
                  <div className="flex flex-col gap-2">
                    <DatePicker
                      onChange={(value) => field.onChange(value ?? undefined)}
                      date={field.value}
                      className={`${field.value?.toString() !== defaultValues.endDate?.toString() ? "" : "!text-muted-foreground"}`}
                      allowFuture
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
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

export default DatesForm;

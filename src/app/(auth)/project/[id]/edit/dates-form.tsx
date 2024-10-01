"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";

const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

type FormDataType = z.infer<typeof schema>;

function DatesForm({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { startDate, endDate },
  });

  const onSubmit = async (data: FormDataType) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    form.reset(data);
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
                  <div className="flex gap-2">
                    <DatePicker onChange={field.onChange} date={field.value} />
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
                  <div className="flex gap-2">
                    <DatePicker onChange={field.onChange} date={field.value} />
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

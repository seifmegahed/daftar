"use client";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";
import { emptyToUndefined } from "@/utils/common";
import { updateSupplierFieldAction } from "@/server/actions/suppliers/update";

const schema = z.object({
  field: z.preprocess(
    emptyToUndefined,
    z
      .string({ required_error: "Field is required" })
      .min(4, { message: "Field must be at least 4 characters" })
      .max(64, { message: "Field must not be longer than 64 characters" }),
  ),
});

type FormDataType = z.infer<typeof schema>;

const FieldUpdateForm = ({ id, field }: { id: number; field: string }) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { field },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateSupplierFieldAction(id, {
        field,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Field updated");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating field");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Field of Business</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update supplier field of business, this will change the field of
                business of the supplier across all references. After typing the
                updated field of business press the update button to persist the
                change.
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
  );
};

export default FieldUpdateForm;

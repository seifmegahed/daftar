"use client";

import { z } from "zod";
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
import { emptyToUndefined } from "@/utils/common";
import { updateItemTypeAction } from "@/server/actions/items/update";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";

const typeSchema = z.object({
  type: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(64, { message: "Type must not be longer than 64 characters" })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof typeSchema>;

const TypeForm = ({
  id,
  defaultValue,
}: {
  id: number;
  defaultValue: string;
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(typeSchema),
    defaultValues: { type: defaultValue },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateItemTypeAction(id, {
        type: data.type,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Website updated successfully");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("an error occurred while updating the website");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Type</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update item type, this will change the type of the item across
                all references. After typing the updated item press the update
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
  );
};

export default TypeForm;

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
import { updateItemMakeAction } from "@/server/actions/items/update";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";

const makeSchema = z.object({
  make: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(64, { message: "Type must not be longer than 64 characters" })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof makeSchema>;

const MakeForm = ({
  id,
  defaultValue,
}: {
  id: number;
  defaultValue: string;
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(makeSchema),
    defaultValues: { make: defaultValue },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateItemMakeAction(id, data);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Make updated");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the make");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Make</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update item make, this will change the make of the item across
                all references. After typing the updated make press the update
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

export default MakeForm;

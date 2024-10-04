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
import { updateItemMpnAction } from "@/server/actions/items/update";
import SubmitButton from "@/components/buttons/submit-button";
import { toast } from "sonner";

const typeSchema = z.object({
  mpn: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(64, { message: "MPN must not be longer than 64 characters" })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof typeSchema>;

const MpnForm = ({
  id,
  defaultValue,
}: {
  id: number;
  defaultValue: string;
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(typeSchema),
    defaultValues: { mpn: defaultValue },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateItemMpnAction(id, data);
      if (error !== null) {
        console.log(error);
        toast.error("Error updating website");
      } else {
        toast.success("Website updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating website");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Manufacturer Part Number</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="mpn"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update item&apos;s MPN, this will change the MPN of the item
                across all references. After typing the updated MPN press the
                update button to persist the change.
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

export default MpnForm;

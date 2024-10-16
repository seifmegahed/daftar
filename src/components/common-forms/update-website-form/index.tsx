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
import type { ReturnTuple } from "@/utils/type-utils";

const websiteSchema = z.object({
  website: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(256, {
        message: "Website must not exceed 256 characters",
      })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof websiteSchema>;

const WebsiteForm = ({
  id,
  updateWebsiteCallbackAction,
  website,
  type,
}: {
  id: number;
  updateWebsiteCallbackAction: (
    id: number,
    data: { website: string | undefined },
  ) => Promise<ReturnTuple<number>>;
  website: string;
  type: "client" | "supplier";
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(websiteSchema),
    defaultValues: { website },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateWebsiteCallbackAction(id, {
        website: data.website,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Website updated successfully");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating website");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Website</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update website, this will change the website of the {type}
                across all references. After typing the updated website press
                the update button to persist the change.
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

export default WebsiteForm;

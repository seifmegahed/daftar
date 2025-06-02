"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/buttons";
import { TagsInput } from "@/components/inputs/tags-input";

import type { ReturnTuple } from "@/utils/type-utils";

const schema = z.object({
  tags: z
    .array(
      z.string().max(256, { message: "Tag must not exceed 256 characters" }),
    )
    .min(1, { message: "At least one tag is required" }),
});

type FormDataType = z.infer<typeof schema>;

const UpdateTagsForm = ({
  id,
  tags,
  onUpdateTags,
}: {
  id: number;
  tags: string[];
  onUpdateTags: (
    id: number,
    tags: string[],
  ) => Promise<
    ReturnTuple<
      | { id?: number; itemId: number; tagId: number }[]
      | { id?: number; supplierId: number; tagId: number }[]
    >
  >;
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { tags },
  });
  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await onUpdateTags(id, data.tags);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Tags updated successfully");
      form.reset(data);
    } catch (error) {
      console.error("Error updating tags:", error);
      toast.error("An error occurred while updating tags");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Update Tags</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Tags *"}</FormLabel>
              <FormControl>
                <TagsInput {...field} />
              </FormControl>
              <FormDescription>
                {
                  "Add tags to categorize the item. type a comma, press space, or select from the suggestions to add a tag."
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            {"Update"}
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
};

export default UpdateTagsForm;

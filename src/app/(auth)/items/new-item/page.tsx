"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addItemAction } from "@/server/actions/items";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";
import { Textarea } from "@/components/ui/textarea";

import { getErrorMessage } from "@/lib/exceptions";
import { notesMaxLength } from "@/data/config";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  type: z
    .string()
    .max(64, { message: "Type must not be longer than 64 characters" }),
  description: z.string().max(notesMaxLength, {
    message: `Description must not be longer than ${notesMaxLength} characters`,
  }),
  mpn: z
    .string()
    .max(64, { message: "MPN must not be longer than 64 characters" }),
  make: z
    .string()
    .max(64, { message: "Make must not be longer than 64 characters" }),
  notes: z.string().max(notesMaxLength, {
    message: `Notes must not be longer than ${notesMaxLength} characters`,
  }),
});

type ItemFormSchemaType = z.infer<typeof schema>;

const defaultValues: ItemFormSchemaType = {
  name: "",
  type: "",
  description: "",
  mpn: "",
  make: "",
  notes: "",
};

function NewItemForm() {
  const form = useForm<ItemFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ItemFormSchemaType) => {
    try {
      const [, error] = await addItemAction(data);
      if (error !== null) return toast.error(error);
      toast.success("Item added successfully");
      form.reset();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <h2 className="text-2xl font-bold">Item Form</h2>
        <Separator />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the item. This is the name you will be using
                to search and refer to the item. It will appear in your
                projects.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the type of the item. This will be used to categorize the
                item and make it easier to search for them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" rows={2} />
              </FormControl>
              <FormDescription>
                Enter a description of the item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the manufacturer of the item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mpn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MPN</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the manufacturer&apos;s part number of the item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" rows={4} />
              </FormControl>
              <FormDescription>Enter any notes about the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            Save
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewItemForm;

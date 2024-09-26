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

const schema = z.object({
  name: z.string({ required_error: "Name is required" }).min(4).max(64),
  type: z.string().max(64),
  description: z.string().max(256),
  mpn: z.string().max(64),
  make: z.string().max(64),
  notes: z.string().max(256),
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
      console.log(data);
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

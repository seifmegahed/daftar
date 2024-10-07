"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { emptyToUndefined } from "@/utils/common";
import { toast } from "sonner";
import type { ReturnTuple } from "@/utils/type-utils";
import type { ReactNode } from "react";

function DeleteForm({
  id,
  name,
  access,
  type,
  disabled = false,
  formInfo,
  onDelete,
}: {
  id: number;
  name: string;
  access: boolean;
  disabled?: boolean;
  type: "client" | "project" | "supplier" | "item" | "document";
  formInfo: ReactNode;
  onDelete: (id: number) => Promise<ReturnTuple<number>>;
}) {
  const schema = z
    .object({
      name: z.preprocess(
        emptyToUndefined,
        z.string({ message: `Name is required to delete the ${type}` }),
      ),
    })
    .superRefine((data, ctx) => {
      if (data.name !== name) {
        ctx.addIssue({
          path: ["name"],
          message: "Name must match",
          code: "custom",
        });
        return false;
      }
    });

  type FormDataType = z.infer<typeof schema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (_data: FormDataType) => {
    if (!access || disabled) {
      toast.error(`You do not have permission to delete this ${type}`);
      return;
    }
    try {
      const [, error] = await onDelete(id);
      if (error !== null) {
        console.log(error);
        toast.error(`Error deleting ${type}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 scroll-smooth" id="delete">
      <h2 className="text-xl font-bold">Delete</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative">
                <Input
                  {...field}
                  className="z-[2] relative"
                  disabled={!access || disabled}
                />
                <p className="absolute top-0 left-[12.5] text-sm text-muted-foreground select-none">{name}</p>
                <FormMessage />
                <FormDescription>{formInfo}</FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access ||
                disabled
              }
              loading={form.formState.isSubmitting}
              variant="destructive"
            >
              Delete
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default DeleteForm;

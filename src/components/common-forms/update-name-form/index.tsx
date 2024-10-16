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

const schema = z.object({
  name: z.preprocess(
    emptyToUndefined,
    z
      .string({ message: "Name is required" })
      .min(4, { message: "Name must be at least 4 characters long" })
      .max(64, { message: "Name must not exceed 64 characters" }),
  ),
});

type FormDataType = z.infer<typeof schema>;

function NameForm({
  name,
  access,
  ownerId,
  id,
  type,
  updateCallbackAction = () =>
    Promise.resolve([null, "Callback function missing"]),
  updateCallbackActionWithOwner,
}: {
  name: string;
  access: boolean;
  ownerId?: number;
  id: number;
  type: "client" | "supplier" | "project" | "item" | "document" | "user";
  updateCallbackAction?: (
    id: number,
    data: { name: string },
  ) => Promise<ReturnTuple<number>>;
  updateCallbackActionWithOwner?: (
    id: number,
    data: { name: string; ownerId: number },
  ) => Promise<ReturnTuple<number>>;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { name },
  });

  const onSubmit = async (data: FormDataType) => {
    if (!access) {
      toast.error(`You do not have permission to change the ${type} name`);
      form.reset({ name });
      return;
    }
    try {
      const [, error] =
        ownerId && updateCallbackActionWithOwner
          ? await updateCallbackActionWithOwner(id, {
              name: data.name,
              ownerId,
            })
          : await updateCallbackAction(id, {
              name: data.name,
            });
      if (error !== null) {
        toast.error(error);
      } else {
        toast.success("Name updated");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating name");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Name</h2>
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
              <FormItem>
                <Input
                  {...field}
                  className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  disabled={!access}
                />
                <FormMessage />
                <FormDescription>
                  {`
                  Update ${type} name, this will change the name of the ${type} 
                  across all references. After typing the updated name press the
                  update button to persist the change. Name of the ${type} 
                  must be unique.`}
                  <br />
                  <strong>Note:</strong>
                  {` Only ${ownerId ? "the owner or" : ""} an
                  admin can change the ${type} name.`}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access
              }
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

export default NameForm;

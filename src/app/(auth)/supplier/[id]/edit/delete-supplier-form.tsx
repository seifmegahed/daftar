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
import { deleteSupplierAction } from "@/server/actions/suppliers/delete";

function DeleteSupplierForm({
  id,
  name,
  access,
}: {
  id: number;
  name: string;
  access: boolean;
}) {
  const schema = z
    .object({
      name: z.preprocess(
        emptyToUndefined,
        z.string({ message: "Supplier name is required to delete the client" }),
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
    if (!access) {
      toast.error("You do not have permission to delete this client");
      return;
    }
    try {
      const [, error] = await deleteSupplierAction(id);
      if (error !== null) {
        console.log(error);
        toast.error("Error deleting client");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 scroll-smooth" id="delete">
      <h2 className="text-xl font-bold">Delete Client</h2>
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
                  placeholder={name}
                  disabled={!access}
                />
                <FormMessage />
                <FormDescription>
                  <strong>
                    Deleting a supplier will delete all addresses and contacts
                    related to the client also the deletion is permanent, you
                    will not be able to undo this action.
                  </strong>{" "}
                  Please type the name of the supplier to confirm. After typing
                  the name press the delete button to delete the supplier.{" "}
                  <br />
                  <strong>Note:</strong> Only an admin can delete a client.
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

export default DeleteSupplierForm;

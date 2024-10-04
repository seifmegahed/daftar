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
import { deleteDocumentAction } from "@/server/actions/documents/delete";

function DeleteDocumentForm({
  documentId,
  name,
  access,
  numberOfReferences,
}: {
  documentId: number;
  name: string;
  access: boolean;
  numberOfReferences: number;
}) {
  const schema = z
    .object({
      name: z.preprocess(
        emptyToUndefined,
        z.string({
          message: "Document name is required to delete the document",
        }),
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
    if (numberOfReferences > 0 || !access) {
      toast.error("You do not have permission to delete this client");
      return;
    }
    try {
      const [, error] = await deleteDocumentAction(documentId);
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
      <h2 className="text-xl font-bold">Delete Document</h2>
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
                {numberOfReferences > 0 ? (
                  <FormDescription>
                    {`You cannot delete a document that is referenced in other
                    database entries. This document is linked to 
                    ${numberOfReferences} 
                    ${numberOfReferences > 1 ? "entries" : "entry"}.`}
                  </FormDescription>
                ) : (
                  <FormDescription>
                    <strong>
                      Deleting a document is permanent, you will not be able to
                      undo this action.
                    </strong>{" "}
                    Please type the name of the document to confirm. After
                    typing the name press the delete button to delete the
                    document.
                    <br />
                    <strong>Note:</strong> Only an admin can delete a document.
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access ||
                numberOfReferences > 0
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

export default DeleteDocumentForm;

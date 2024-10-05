"use client";

import type { SimpDoc } from "@/server/db/tables/document/queries";
import { z } from "zod";
import type { GeneratedRelationType } from ".";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import ComboSelect from "@/components/combo-select-obj";
import SubmitButton from "@/components/buttons/submit-button";
import { Separator } from "@/components/ui/separator";
import { addDocumentRelationAction } from "@/server/actions/document-relations/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  id: z.number(),
});

type FormSchemaType = z.infer<typeof schema>;

function ExistingDocumentForm({
  documents,
  relation,
}: {
  documents: Pick<SimpDoc, "id" | "name" | "extension">[];
  relation: GeneratedRelationType;
}) {
  const navigate = useRouter();

  const documentOptions = documents.map((document) => ({
    label: document.name + ` (.${document.extension})`,
    value: document.id,
  }));

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { id: undefined },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const [, error] = await addDocumentRelationAction({
      ...relation,
      documentId: data.id,
    });
    if (error !== null) {
      console.log(error);
      toast.error("Error adding document relation");
    } else {
      toast.success("Document relation added successfully");
      navigate.replace("documents");
    }
  };

  return (
    <form
      {...form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold">Existing Document Form</h2>
      <Separator />
      <Form {...form}>
        <FormField
          name="id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <ComboSelect
                options={documentOptions}
                onChange={field.onChange}
                value={field.value}
              />
              <FormDescription>
                Search and select the document you want to link. After selecting
                the document, press submit to link the document.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
          >
            Submit
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default ExistingDocumentForm;

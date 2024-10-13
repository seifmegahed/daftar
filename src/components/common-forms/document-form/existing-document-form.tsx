"use client";

import type { SimpDoc } from "@/server/db/tables/document/queries";
import { z } from "zod";
import type { GeneratedRelationType, RelationDataType } from ".";
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

const schema = z.object({
  id: z.number(),
});

type FormSchemaType = z.infer<typeof schema>;

function ExistingDocumentForm({
  documents,
  generatedRelation,
  relationData,
}: {
  documents: Pick<SimpDoc, "id" | "name" | "extension">[];
  generatedRelation: GeneratedRelationType;
  relationData: RelationDataType;
}) {
  const documentOptions = documents.map((document) => ({
    label: document.name + ` (.${document.extension})`,
    value: document.id,
  }));

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { id: undefined },
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await addDocumentRelationAction(
        {
          ...generatedRelation,
          documentId: data.id,
        },
        relationData,
      );
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        console.log(error);
        toast.error("Error adding document");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding document");
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

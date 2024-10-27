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
import { addDocumentRelationAction } from "@/server/actions/document-relations/create";
import { toast } from "sonner";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";

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
        toast.error(error);
        return;
      }
      toast.success("Document added");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding document");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Add Existing Document"
          description="Add an existing document to the project"
          buttonText="Add Document"
          submitting={form.formState.isSubmitting}
          dirty={form.formState.isDirty}
        >
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
                  Search and select the document you want to link. After
                  selecting the document, press submit to link the document.
                </FormDescription>
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default ExistingDocumentForm;

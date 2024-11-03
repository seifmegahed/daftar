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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("document-form.existing-document-form");

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
      toast.success(t("success"));
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
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
                  selectMessage={t("select-message")}
                  searchMessage={t("search-message")}
                  notFoundMessage={t("not-found-message")}
                />
                <FormDescription>{t("id-field-description")}</FormDescription>
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default ExistingDocumentForm;

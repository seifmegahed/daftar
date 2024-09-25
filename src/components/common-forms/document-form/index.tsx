"use client";

import SubmitButton from "@/components/buttons/submit-button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type RelationDataType = {
  relationTo: "client" | "supplier" | "project" | "item";
  relationId: number;
};

function generateRelation(relation: RelationDataType) {
  const { relationTo, relationId } = relation;
  switch (relationTo) {
    case "client":
      return {
        clientId: relationId,
        supplierId: null,
        projectId: null,
        itemId: null,
      };
    case "supplier":
      return {
        supplierId: relationId,
        clientId: null,
        projectId: null,
        itemId: null,
      };
    case "project":
      return {
        projectId: relationId,
        clientId: null,
        supplierId: null,
        itemId: null,
      };
    case "item":
      return {
        itemId: relationId,
        clientId: null,
        supplierId: null,
        projectId: null,
      };
    default:
      throw new Error("Invalid relation type");
  }
}

const documentSchema = z.object({
  name: z.string().min(4).max(64),
  notes: z.string().max(256),
  file: z.instanceof(File),
});

type FormSchemaType = z.infer<typeof documentSchema>;

function DocumentForm({ relationData }: { relationData?: RelationDataType }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      notes: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    if (relationData) {
      const relation = generateRelation(relationData);
      const body = new FormData();
      body.append("file", data.file);
      body.append(
        "document",
        JSON.stringify({ name: data.name, notes: data.notes }),
      );
      body.append("relation", JSON.stringify(relation));
      const response = await fetch("/api/upload-relational-document", {
        method: "POST",
        body,
      });
      if (!response.ok) toast.error("Error adding document");
      else {
        toast.success("Document added successfully");
      }
    } else {
      // implement document without relation server action
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <h1>Document Form</h1>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} />
              <FormDescription>
                Enter the name of the document. This is the name you will be
                using to search and refer to the document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <Textarea {...field} rows={3} className="resize-none" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <Input
                type="file"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
              <FormDescription>
                Upload the document file. This file will be stored in the
                server.
              </FormDescription>
              <FormMessage />
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

export default DocumentForm;

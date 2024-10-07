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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { notesMaxLength } from "@/data/config";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { GeneratedRelationType } from ".";
import Dropzone from "@/components/inputs/drop-zone";
import { useRouter } from "next/navigation";

const documentSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  notes: z.string().max(notesMaxLength, {
    message: `Notes must not be longer than ${notesMaxLength} characters`,
  }),
  file: z.instanceof(File),
});

type FormSchemaType = z.infer<typeof documentSchema>;

function NewDocumentForm({ relation }: { relation?: GeneratedRelationType }) {
  const navigate = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      notes: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    if (relation) {
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
        form.reset();
        toast.success("Document added successfully");
        navigate.replace("documents");
      }
    } else {
      const body = new FormData();
      body.append(
        "document",
        JSON.stringify({ name: data.name, notes: data.notes }),
      );
      body.append("file", data.file);
      const response = await fetch("/api/upload-document", {
        method: "POST",
        body,
      });
      if (!response.ok) toast.error("Error adding document");
      else {
        form.reset();
        toast.success("Document added successfully");
        navigate.push("/documents");
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <h2 className="text-2xl font-bold">New Document Form</h2>
        <Separator />
        <FormField
          name="file"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Dropzone
                onUpload={(file) => field.onChange(file)}
                file={field.value}
              />
            </FormItem>
          )}
        />
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

export default NewDocumentForm;

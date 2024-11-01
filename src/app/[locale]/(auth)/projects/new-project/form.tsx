"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import ComboSelect from "@/components/combo-select-obj";
import { addProjectAction } from "@/server/actions/projects/create";
import { projectTypes, statusCodes } from "@/data/lut";
import { notesMaxLength } from "@/data/config";

import type { UserBriefType } from "@/server/db/tables/user/queries";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  type: z.number({ required_error: "Type is required" }),
  status: z.number({ required_error: "Status is required" }),
  description: z.string().max(notesMaxLength, {
    message: `Description must not be longer than ${notesMaxLength} characters`,
  }),
  notes: z.string().max(notesMaxLength, {
    message: `Notes must not be longer than ${notesMaxLength} characters`,
  }),
  clientId: z.number({ required_error: "Client is required" }),
  ownerId: z.number({ required_error: "Owner is required" }),
});

type ProjectFormSchemaType = z.infer<typeof schema>;

const defaultValues = {
  name: "",
  status: 0,
  description: "",
  notes: "",

  clientId: undefined,
  ownerId: undefined,
};

type NewProjectFormProps = {
  userList: UserBriefType[];
  clientList: UserBriefType[];
};

function NewProjectForm({ userList, clientList }: NewProjectFormProps) {
  const t = useTranslations("projects.new-project-page");
  const locale = useLocale() as "en" | "ar";
  const direction = getDirection(locale);

  const form = useForm<ProjectFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ProjectFormSchemaType) => {
    try {
      const response = await addProjectAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success("Project added");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the project");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name-field-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{t("name-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("type-field-label")}</FormLabel>
                <Select
                  defaultValue={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  dir={direction}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectTypes.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={String(status.value)}
                      >
                        {status[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t("type-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status-field-label")}</FormLabel>
                <Select
                  defaultValue={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  dir={direction}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusCodes.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={String(status.value)}
                      >
                        {status[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("status-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="clientId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("client-field-label")}</FormLabel>
                <FormControl>
                  <ComboSelect
                    value={field.value as number}
                    onChange={(value) => field.onChange(value)}
                    options={clientList.map((client) => ({
                      value: client.id,
                      label: client.name,
                    }))}
                    selectMessage={t("client-select-message")}
                    searchMessage={t("client-search-message")}
                    notFoundMessage={t("client-not-found-message")}
                  />
                </FormControl>
                <FormDescription>
                  {t("client-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="ownerId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("owner-field-label")}</FormLabel>
                <FormControl>
                  <ComboSelect
                    value={field.value as number}
                    onChange={(value) => field.onChange(value)}
                    options={userList.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                    selectMessage={t("owner-select-message")}
                    searchMessage={t("owner-search-message")}
                    notFoundMessage={t("owner-not-found-message")}
                  />
                </FormControl>
                <FormDescription>
                  {t("owner-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description-field-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={2} />
                </FormControl>
                <FormDescription>
                  {t("description-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("notes-field-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {t("notes-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewProjectForm;

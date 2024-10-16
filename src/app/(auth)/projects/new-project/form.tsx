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
import type { UserBriefType } from "@/server/db/tables/user/queries";
import ComboSelect from "@/components/combo-select-obj";
import { addProjectAction } from "@/server/actions/projects/create";
import { statusCodes } from "@/data/lut";
import { notesMaxLength } from "@/data/config";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
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
      toast.success("Project added")
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
          title="Add Project"
          description="Enter the details of the project you want to add."
          buttonText="Add Project"
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of the project. This is the name you will be
                  using to search and refer to the project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  defaultValue={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
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
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the status of the project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="clientId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Client *</FormLabel>
                <FormControl>
                  <ComboSelect
                    value={field.value as number}
                    onChange={(value) => field.onChange(value)}
                    options={clientList.map((client) => ({
                      value: client.id,
                      label: client.name,
                    }))}
                    selectMessage="Select client"
                    searchMessage="Search for client"
                    notFoundMessage="Client not found."
                  />
                </FormControl>
                <FormDescription>
                  Select the client that this project is for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="ownerId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Owner *</FormLabel>
                <FormControl>
                  <ComboSelect
                    value={field.value as number}
                    onChange={(value) => field.onChange(value)}
                    options={userList.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                    selectMessage="Select user"
                    searchMessage="Search for user"
                    notFoundMessage="User not found."
                  />
                </FormControl>
                <FormDescription>
                  Select the user who will be responsible for this project.
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={2} />
                </FormControl>
                <FormDescription>
                  Enter a description of the project.
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
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  Enter any notes about the project.
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

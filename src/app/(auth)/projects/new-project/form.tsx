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
import SubmitButton from "@/components/buttons/submit-button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import { getErrorMessage } from "@/lib/exceptions";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import type { UserBriefType } from "@/server/db/tables/user/queries";
import ComboSelect from "@/components/combo-select-obj";
import { addProjectAction } from "@/server/actions/projects";
import { statusCodes } from "@/data/lut";

const schema = z.object({
  name: z.string({ required_error: "Name is required" }).min(4).max(64),
  status: z.number(),
  description: z.string().max(256),
  notes: z.string().max(256),
  clientId: z.number(),
  ownerId: z.number(),
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
      const [, error] = await addProjectAction(data);
      if (error !== null) return toast.error(error);
      console.log(data);
      toast.success("Project added successfully");
      form.reset();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
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
              <FormLabel>Status</FormLabel>
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
                    <SelectItem key={status.value} value={String(status.value)}>
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
              <FormLabel>Client</FormLabel>
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
              <FormLabel>Owner</FormLabel>
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
              <FormLabel>Description (Optional)</FormLabel>
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
              <FormLabel>Notes (Optional)</FormLabel>
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
        <div className="flex justify-end">
          <SubmitButton
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            Save
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewProjectForm;

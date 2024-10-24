"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreateUserAction } from "@/server/actions/users";

import { defaultValues, schema, type NewUserFormType } from "./schema";

import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";

function NewUserForm() {
  const form = useForm<NewUserFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: NewUserFormType) => {
    try {
      const response = await adminCreateUserAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success("User added");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the user");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Add User"
          description="Enter the details of the user you want to add."
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
          buttonText="Add User"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="username">User Name *</Label>
                <Input
                  id="username"
                  type="username"
                  autoComplete="new-username"
                  {...field}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value
                        .toLowerCase()
                        .trim()
                        .replaceAll(" ", ""),
                    )
                  }
                />
                <FormDescription>
                  User&apos;s username must be at least 4 characters long and
                  must be unique. It cannot contain spaces or upper case
                  letters. The user will use this username to login.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="name"
                  autoComplete="new-name"
                  {...field}
                />
                <FormMessage />
                <FormDescription>
                  User&apos;s name must be at least 4 characters long. This name
                  will be reflected in the user&apos;s avatar, and will be used
                  to identify the user in the app. It is preferable to use a
                  first name and a last name separated by a space (e.g. John
                  Doe).
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  dir="ltr"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="s-user">Super User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  User&apos;s role determines what actions they can perform in
                  the app. Admins can perform all actions, while users can only
                  perform limited actions. Admins can also add and edit users.
                  <br />
                  You can check the permission table for more information.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
                <FormDescription>
                  User&apos;s password must be at least 8 characters long and
                  contain at least one uppercase letter, one lowercase letter,
                  and one number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifyPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="verify-password">Verify Password *</Label>
                <Input
                  id="verify-password"
                  type="password"
                  autoComplete="new-password-verify"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewUserForm;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultValues, schema, type NewUserFormType } from "./schema";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { addUserAction } from "@/server/actions/users";
import { useRouter } from "next/navigation";

export default function NewUserForm() {
  const router = useRouter();
  const form = useForm<NewUserFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: NewUserFormType) => {
    await addUserAction(data)
      .then((res) => {
        console.log("User added:", res);
        form.reset();
        router.refresh();
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        if (
          error instanceof Error &&
          error.message.includes("Username already exists")
        ) {
          form.setError("username", {
            type: "manual",
            message: "Username already exists",
          });
          return;
        }
        alert("Error adding user");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Add User</CardTitle>
          <CardDescription>
            Enter the details of the user you want to add.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="username">User Name</Label>
                <Input id="username" type="username" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifyPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="verify-password">Verify Password</Label>
                <Input id="verify-password" type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="w-60" type="submit">
            Add User
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

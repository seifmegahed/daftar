"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultValues, schema, type ChangePasswordFormType } from "./schema";
import { changePasswordAction } from "@/server/actions/auth/change-password";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { changePasswordErrors } from "@/server/actions/auth/change-password/errors";

export default function ChangePasswordForm() {
  const router = useRouter();
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    changePasswordAction(data)
      .then((res) => {
        const [, error] = res;
        if (error) {
          form.setError(
            error === changePasswordErrors.userNotFound
              ? "username"
              : "verifyPassword",
            {
              type: "manual",
              message: error,
            },
            { shouldFocus: true },
          );
        }
        router.replace("/login");
      })
      .catch((error) => console.error("Error changing password:", error));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Change Password</CardTitle>
              <CardDescription>
                Enter your username below to change your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <Label htmlFor="username">User Name</Label>
                    <Input id="username" type="username" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
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
                  <FormItem className="grid gap-2">
                    <Label htmlFor="verify-password">Verify Password</Label>
                    <Input id="verify-password" type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign up
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultValues, schema, type LoginFormType } from "./schema";

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
import { loginAction } from "@/server/actions/auth/login";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormType) => {
    await loginAction(data)
      .then(() => {
        router.replace("/");
      })
      .catch((error: Error) => {
        if (error.message === "Incorrect password")
          form.setError(
            "password",
            {
              type: "manual",
              message: "Incorrect password",
            },
            { shouldFocus: true },
          );
        else if (error.message === "User not found")
          form.setError(
            "username",
            {
              type: "manual",
              message: "User not found",
            },
            { shouldFocus: true },
          );
        else console.error("Error logging in:", error);
      });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your username and password below to sign in.
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
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

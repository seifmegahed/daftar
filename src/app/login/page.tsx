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
import LoadingOverlay from "@/components/loading-overlay";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormType) => {
    await loginAction(data)
      .then((res) => {
        if (res?.error)
          form.setError("password", { type: "manual", message: res.error });
        if (res?.error === "Incorrect password")
          form.setError(
            "password",
            {
              type: "manual",
              message: "Incorrect password",
            },
            { shouldFocus: true },
          );
        else if (res?.error === "User not found")
          form.setError(
            "username",
            {
              type: "manual",
              message: "User not found",
            },
            { shouldFocus: true },
          );
        else router.replace("/");
      })
      .catch((error: Error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-md py-8 relative overflow-hidden">
        <LoadingOverlay state={form.formState.isSubmitting} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your username and password below to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
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

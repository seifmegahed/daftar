"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/server/actions/auth/login";
import { toast } from "sonner";
import { env } from "@/env";
import { defaultValues, schema, type LoginFormType } from "./schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/inputs/password";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";

export default function LoginForm() {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const response = await loginAction(data);
      if (!response) return;
      const [, error] = response;
      if (error !== null) return toast.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="relative w-full max-w-md overflow-hidden py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sign In to {env.NEXT_PUBLIC_VERCEL ? "Daftar Demo" : "Daftar"}
              </CardTitle>
              <CardDescription>
                Enter your username and password below to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">Username</Label>
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
                    <PasswordInput id="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full mt-5"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loading className="h-5 w-5" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}

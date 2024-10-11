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
import { PasswordInput } from "@/components/inputs/password";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { loginAction } from "@/server/actions/auth/login";
import LoadingOverlay from "@/components/loading-overlay";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/exceptions";
import { env } from "process";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const [result, error] = await loginAction(data);
      if (error !== null) return toast.error(error);
      else if (result) router.push("/");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="relative w-full max-w-md overflow-hidden py-8">
        <LoadingOverlay state={form.formState.isSubmitting} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sign In {env.NEXT_PUBLIC_VERCEL ? "Vercel" : "Local"}
              </CardTitle>
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
                    <PasswordInput id="password" {...field} />
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

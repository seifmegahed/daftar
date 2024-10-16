"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/server/actions/auth/login";
import { toast } from "sonner";
import { env } from "@/env";
import { defaultValues, schema, type LoginFormType } from "./schema";

import { Button } from "@/components/ui/button";
import {
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
import Balancer from "react-wrap-balancer";
import { BookmarkIcon } from "@/icons";
import DaftarArabicIcon from "@/icons/daftar-arabic-icon";
import { ChevronDown } from "lucide-react";

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
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success("Logged in");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <div className="grid h-screen w-screen scroll-smooth lg:grid-cols-2">
      <LoginInfoSection />
      <div className="flex h-screen w-full items-center justify-center bg-background lg:h-full">
        <div className="relative w-full max-w-md overflow-hidden py-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Form {...form}>
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
                  className="mt-5 w-full"
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
            </Form>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoginInfoSection() {
  return (
    <div className="flex h-screen w-full items-center justify-center lg:h-full bg-muted">
      <div className="flex w-full lg:h-screen h-full max-w-screen-md flex-col items-center gap-4 text-center text-sm text-muted-foreground justify-between lg:justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full flex-grow">
          <BookmarkIcon className="h-16 w-16 stroke-secondary-foreground dark:fill-secondary-foreground dark:stroke-none" />
          <DaftarArabicIcon className="stroke-secondary-foreground" />
          <h1 className="mb-4 text-center text-4xl font-bold text-secondary-foreground">
            {`Welcome to Daftar ${env.NEXT_PUBLIC_VERCEL ? "Demo" : ""}`}
          </h1>
          <p>
            <Balancer>
              Daftar is an application that allows you to manage your
              contracting company&apos;s data in one place. The word Daftar in
              arabic means <i>a folder of records</i>
            </Balancer>
          </p>
          <p className="hidden lg:block">Sign in to your account to continue</p>
          <p className="block lg:hidden">
            Sign in to your account below to continue
          </p>
          {env.NEXT_PUBLIC_VERCEL ? (
            <p>
              <Balancer>
                If you don&apos;t have an account, you can ask for a demo
                account by sending and email to seifmegahed at me dot com
              </Balancer>
            </p>
          ) : (
            <>
              <p>
                <Balancer>
                  If you don&apos;t have an account, you should ask an admin to
                  create one for you. If you forgot your password, you have to
                  ask an admin to reset your password
                </Balancer>
              </p>
            </>
          )}
        </div>
        <div className="flex items-end pb-16 lg:hidden">
          <div
            onClick={() => window.scrollTo(0, window.innerHeight)}
            className="animate-pulse cursor-pointer"
          >
            <ChevronDown className="h-24 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { adminUpdateUserPasswordAction } from "@/server/actions/users";

import { UserSchema } from "@/server/db/tables/user/schema";
import { checkPasswordComplexity } from "@/utils/password-complexity";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";

const changePasswordSchema = UserSchema.pick({
  password: true,
  verifyPassword: true,
}).superRefine(({ password, verifyPassword }, ctx) => {
  if (!checkPasswordComplexity(password)) {
    ctx.addIssue({
      path: ["password"],
      code: z.ZodIssueCode.custom,
      message:
        "Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    });
    return false;
  }
  if (password !== verifyPassword) {
    ctx.addIssue({
      path: ["verifyPassword"],
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
    });
    return false;
  }
  return true;
});

type FormSchemaType = z.infer<typeof changePasswordSchema>;

function ChangePasswordSection({ userId }: { userId: number }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const [result, error] = await adminUpdateUserPasswordAction({
      id: userId,
      password: data.password,
      verifyPassword: data.verifyPassword,
    });
    if (error !== null) return toast.error(error);
    toast.success(`Password updated successful for User ID: ${result}`);
    form.reset();
  };

  return (
    <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <div className="flex flex-col gap-4 py-4">
          <LabelWrapper label="Password" />
          <FormField
            name="password"
            render={({ field }) => (
              <div className="flex flex-col gap-4">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
                <FormMessage {...field} />
              </div>
            )}
          />
          <FormField
            name="verifyPassword"
            render={({ field }) => (
              <div className="flex flex-col gap-4">
                <Label htmlFor="verify">Verify Password</Label>
                <Input
                  id="verify"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
                <FormMessage {...field} />
              </div>
            )}
          />
          <p className="text-xs text-muted-foreground">
            Change the password of the user, Password must be at least 8
            characters long and must contain at least one uppercase letter, one
            lowercase letter, one number and one special character.
            <br></br>
            <br></br>
            <strong>Note:</strong>
            <br></br>
            If you want to revoke the user's access you can deactivate their
            account below.
            <br></br>
            <br></br>
            Use this feature only if the user forgets their password. If the
            user just wants to change their password, they can do so from their
            user's settings page while logged in. They can find the settings
            page by clicking on their avatar in the top right corner of the
            application.
          </p>
          <div className="flex justify-end py-4">
            <SubmitButton
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              Save
            </SubmitButton>
          </div>
        </div>
      </Form>
    </form>
  );
}

export default ChangePasswordSection;

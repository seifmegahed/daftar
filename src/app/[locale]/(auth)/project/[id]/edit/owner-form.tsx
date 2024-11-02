"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProjectOwnerAction } from "@/server/actions/projects/update";

import type { UserBriefType } from "@/server/db/tables/user/queries";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const schema = z.object({
  ownerId: z.preprocess((value: unknown) => Number(value), z.number()),
});

type FormDataType = z.infer<typeof schema>;

function OwnerForm({
  projectId,
  ownerId,
  users,
  access,
}: {
  projectId: number;
  ownerId: number;
  users: UserBriefType[];
  access: boolean;
}) {
  const locale = useLocale() as "ar" | "en";
  const direction = getDirection(locale);
  const t = useTranslations("project.edit.owner-form");

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { ownerId },
  });

  const onSubmit = async (data: FormDataType) => {
    if (!access) {
      toast.error(t("unauthorized"));
      form.reset({ ownerId });
      return;
    }
    try {
      const [, error] = await updateProjectOwnerAction(projectId, {
        ownerId: data.ownerId,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("title")}</h2>
      <Separator />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <FormField
            name="ownerId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={String(ownerId)}
                  value={String(field.value)}
                  onValueChange={field.onChange}
                  disabled={!access}
                  dir={direction}
                >
                  <SelectTrigger
                    className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>
                  {t("description")}
                  <br />
                  <strong>{t("note")}</strong>
                  {t("note-content")}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !access
              }
              loading={form.formState.isSubmitting}
            >
              {t("update")}
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default OwnerForm;

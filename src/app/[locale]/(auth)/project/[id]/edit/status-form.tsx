"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { statusCodes } from "@/data/lut";
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
import { updateProjectStatusAction } from "@/server/actions/projects/update";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const schema = z.object({
  status: z.preprocess((value: unknown) => Number(value), z.number()),
});

type FormDataType = z.infer<typeof schema>;

function StatusForm({
  status,
  projectId,
}: {
  status: number;
  projectId: number;
}) {
  const t = useTranslations("project.edit.status-form");
  const locale = useLocale() as "ar" | "en";
  const direction = getDirection(locale);
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { status },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateProjectStatusAction(projectId, data);
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
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={String(status)}
                  value={String(field.value)}
                  onValueChange={field.onChange}
                  dir={direction}
                >
                  <SelectTrigger
                    className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusCodes
                      .sort((a, b) => a[locale].localeCompare(b[locale]))
                      .map((code) => (
                        <SelectItem key={code.value} value={String(code.value)}>
                          {code[locale]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>{t("description")}</FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
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

export default StatusForm;

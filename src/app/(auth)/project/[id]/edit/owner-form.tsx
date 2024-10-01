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
import { UserBriefType } from "@/server/db/tables/user/queries";

const schema = z.object({
  ownerId: z.preprocess((value: unknown) => Number(value), z.number()),
});

type FormDataType = z.infer<typeof schema>;

function OwnerForm({
  ownerId,
  users,
  access,
}: {
  ownerId: number;
  users: UserBriefType[];
  access: boolean;
}) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { ownerId },
  });

  const onSubmit = async (data: FormDataType) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    form.reset(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Project Owner</h2>
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
                  Update project owner. After selecting the desired owner press
                  the update button to persist the change. <br />
                  <strong>Note:</strong> Only the owner or an admin can change the project owner.
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
              Update
            </SubmitButton>
          </div>
        </Form>
      </form>
    </div>
  );
}

export default OwnerForm;

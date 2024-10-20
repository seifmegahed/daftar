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
import { type UserBriefType } from "@/server/db/tables/user/queries";
import { toast } from "sonner";
import { updateProjectOwnerAction } from "@/server/actions/projects/update";

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
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { ownerId },
  });

  const onSubmit = async (data: FormDataType) => {
    if (!access) {
      toast.error("You do not have permission to change the project owner");
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
      toast.success("Project owner updated");
      form.reset(data);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the owner");
    }
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
                  <strong>Note:</strong> Only the owner or an admin can change
                  the project owner.
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

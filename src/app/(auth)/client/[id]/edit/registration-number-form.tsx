"use client";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "@/components/buttons/submit-button";
import { updateClientRegistrationNumberAction } from "@/server/actions/clients";
import { toast } from "sonner";
import { emptyToUndefined } from "@/utils/common";

const schema = z.object({
  registrationNumber: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(256, {
        message: "Registration number must not exceed 256 characters",
      })
      .optional(),
  ),
});

type FormDataType = z.infer<typeof schema>;

const RegistrationNumberForm = ({
  clientId,
  registrationNumber,
}: {
  clientId: number;
  registrationNumber: string;
}) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: { registrationNumber },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const [, error] = await updateClientRegistrationNumberAction(clientId, {
        registrationNumber: data.registrationNumber,
      });
      if (error !== null) {
        console.log(error);
        toast.error("Error updating registration number");
      } else {
        toast.success("Registration number updated successfully");
        form.reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating registration number");
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Registration Number</h2>
      <Separator />
      <Form {...form}>
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                className={`${form.formState.isDirty ? "" : "!text-muted-foreground"}`}
              />
              <FormMessage />
              <FormDescription>
                Update client registration number, this will change the
                registration number of the client across all references. After
                typing the updated registration number press the update button
                to persist the change.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            loading={form.formState.isSubmitting}
          >
            Update
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
};

export default RegistrationNumberForm;

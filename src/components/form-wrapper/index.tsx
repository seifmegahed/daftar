import type { ReactNode } from "react";
import { Separator } from "../ui/separator";
import SubmitButton from "../buttons/submit-button";

export function FormWrapper({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-8 px-2 sm:px-0">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Separator />
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function FormWrapperWithSubmit({
  children,
  title,
  description,
  buttonText,
  dirty,
  submitting,
}: {
  children: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  dirty: boolean;
  submitting: boolean;
}) {
  return (
    <FormWrapper title={title} description={description}>
      {children}
      <div className="flex justify-end py-4">
        <SubmitButton
          type="submit"
          data-testid="submit-button"
          disabled={submitting || !dirty}
          loading={submitting}
        >
          {buttonText}
        </SubmitButton>
      </div>
    </FormWrapper>
  );
}

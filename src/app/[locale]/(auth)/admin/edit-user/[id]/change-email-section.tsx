"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserSchema } from "@/server/db/tables/user/schema";
import {
  adminUpdateUserEmailAction,
  userUpdateUserEmailAction,
} from "@/server/actions/users";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";

const schema = UserSchema.pick({
  email: true,
});

function ChangeEmailSection({
  userId,
  email,
  type,
}: {
  userId: number;
  email: string;
  type: "admin" | "user";
}) {
  const [newEmail, setNewEmail] = useState(email);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(email !== newEmail && newEmail !== "" ? true : false);
  }, [email, newEmail]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = schema.safeParse({ email: newEmail });
    if (!isValid.success) {
      setErrorMessage("Email must be at least 4 characters long");
      setLoading(false);
      return;
    } else setErrorMessage("");
    try {
      const [, error] =
        type === "admin"
          ? await adminUpdateUserEmailAction({
              id: userId,
              email: newEmail,
            })
          : await userUpdateUserEmailAction({
              id: userId,
              email: newEmail,
            });
      setLoading(false);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Email updated");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the email");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelWrapper htmlFor="new-email" label="Email" />
      <Input
        id="new-email"
        placeholder="Email"
        type="text"
        value={newEmail}
        autoComplete="none"
        onChange={(event) => setNewEmail(event.target.value)}
        className={`${change ? "" : "!text-muted-foreground"}`}
      />
      {errorMessage !== "" ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Change the email of the user. This email will be used in the commercial
        offer documents if the user is the project owner/manager.
      </p>
      <div className="flex justify-end py-4">
        <SubmitButton
          disabled={!change || loading}
          loading={loading}
          onClick={onsubmit}
        >
          Save
        </SubmitButton>
      </div>
    </div>
  );
}

export default ChangeEmailSection;

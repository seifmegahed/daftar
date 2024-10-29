"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserSchema } from "@/server/db/tables/user/schema";
import {
  adminUpdateUserPhoneNumberAction,
  userUpdateUserPhoneNumberAction,
} from "@/server/actions/users";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";

const schema = UserSchema.pick({
  phoneNumber: true,
});

function ChangePhoneNumberSection({
  userId,
  phoneNumber,
  type,
}: {
  userId: number;
  phoneNumber: string;
  type: "admin" | "user";
}) {
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(
      phoneNumber !== newPhoneNumber && newPhoneNumber !== "" ? true : false,
    );
  }, [phoneNumber, newPhoneNumber]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = schema.safeParse({ phoneNumber: newPhoneNumber });
    if (!isValid.success) {
      setErrorMessage("Phone Number is invalid");
      setLoading(false);
      return;
    } else setErrorMessage("");
    try {
      const [, error] =
        type === "admin"
          ? await adminUpdateUserPhoneNumberAction({
              id: userId,
              phoneNumber: newPhoneNumber,
            })
          : await userUpdateUserPhoneNumberAction({
              id: userId,
              phoneNumber: newPhoneNumber,
            });
      setLoading(false);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Phone Number updated");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the phoneNumber");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelWrapper htmlFor="new-phoneNumber" label="Phone Number" />
      <Input
        id="new-phoneNumber"
        placeholder="+20 123 456 7890"
        type="text"
        value={newPhoneNumber}
        autoComplete="none"
        onChange={(event) => setNewPhoneNumber(event.target.value)}
        className={`${change ? "" : "!text-muted-foreground"}`}
      />
      {errorMessage !== "" ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Change the phone number of the user. This phone number will be used in
        the commercial offer documents if the user is the project owner/manager.
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

export default ChangePhoneNumberSection;

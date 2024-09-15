"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserSchema } from "@/server/db/tables/user/schema";
import { updateUserNameAction } from "@/server/actions/users";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "../label-wrapper";

const changeNameSchema = UserSchema.pick({
  name: true,
});

function ChangeNameSection({ userId, name }: { userId: number; name: string }) {
  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(name !== newName && newName !== "" ? true : false);
  }, [name, newName]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = changeNameSchema.safeParse({ name: newName });
    if (!isValid.success) {
      setErrorMessage("Name must be at least 4 characters long");
      setLoading(false);
      return;
    } else setErrorMessage("");
    const [response, error] = await updateUserNameAction({
      id: userId,
      name: newName,
    });
    setLoading(false);
    if (error !== null) return toast.error(error);
    setNewName("");
    toast.success(`User ID: ${response} name updated`);
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <LabelWrapper htmlFor="new-name" label="Name" />
      <Input
        id="new-name"
        placeholder="Name"
        type="text"
        value={newName}
        autoComplete="none"
        onChange={(event) => setNewName(event.target.value)}
      />
      {errorMessage !== "" ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Change the name of the user, The avatar initials depend on the name. it
        is preferable to use a first name and a last name separated by a space.
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

export default ChangeNameSection;

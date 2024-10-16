"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserSchema } from "@/server/db/tables/user/schema";
import { adminUpdateUserDisplayNameAction } from "@/server/actions/users";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";

const changeNameSchema = UserSchema.pick({
  name: true,
});

function ChangeNameSection({ userId, name }: { userId: number; name: string }) {
  const [newName, setNewName] = useState(name);
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
    try {
      const [response, error] = await adminUpdateUserDisplayNameAction({
        id: userId,
        name: newName,
      });
      setLoading(false);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Name updated");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the name");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelWrapper htmlFor="new-name" label="Name" />
      <Input
        id="new-name"
        placeholder="Name"
        type="text"
        value={newName}
        autoComplete="none"
        onChange={(event) => setNewName(event.target.value)}
        className={`${change ? "" : "!text-muted-foreground"}`}
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

"use client";

import { useEffect, useState } from "react";
import LabelWrapper from "../label-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ChangeNameSection({ name }: { name: string }) {
  const [newName, setNewName] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    setChange(name !== newName && newName !== "" ? true : false);
  }, [name, newName]);

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
      <p className="text-xs text-muted-foreground">
        Change the name of the user, The avatar initials depend on the name. it
        is preferable to use a first name and a last name separated by a space.
      </p>
      <div className="flex justify-end py-4">
        <Button variant="outline" className="w-40" disabled={!change}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default ChangeNameSection;

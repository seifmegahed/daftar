"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import LabelWrapper from "../label-wrapper";

const roleItems = [
  {
    label: "Admin",
    value: "admin",
    description: "Has access to the admin panel, can add and edit users",
  },
  {
    label: "User",
    value: "user",
    description: "Regular user, can preform all actions except admin panel",
  },
]

function ChangeRoleSection({ userRole }: { userRole: string }) {
  const [role, setRole] = useState(userRole);
  const [change, setChange] = useState(false);

  useEffect(() => {
    setChange(userRole === role ? false : true);
  }, [userRole, role]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <LabelWrapper htmlFor="role" label="Role" />
      <Select onValueChange={setRole} value={role}>
        <SelectTrigger>
          <SelectValue>
            {roleItems.find((item) => item.value === role)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roleItems.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              <span>{item.label}</span>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Change role of user, Careful not to change your own role to a lower role
        which would result in loss of access to the admin panel. Once saved the
        changes will take effect once the user logs out.
      </p>
      <div className="flex justify-end py-4">
        <Button variant="outline" className="w-40" disabled={!change}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default ChangeRoleSection;

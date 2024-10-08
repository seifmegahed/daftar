"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminUpdateUserRoleAction } from "@/server/actions/users";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/buttons/submit-button";
import LabelWrapper from "./label-wrapper";

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
];

function ChangeRoleSection({
  userId,
  userRole,
}: {
  userId: number;
  userRole: string;
}) {
  const [role, setRole] = useState(userRole);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(userRole === role ? false : true);
  }, [userRole, role]);

  const handleSubmit = async () => {
    setLoading(true);
    const [response, error] = await adminUpdateUserRoleAction({
      id: userId,
      role: role,
    });
    setLoading(false);
    if (error !== null) return toast.error(error);
    toast.success(`Role updated successful for User ID: ${response}`);
  };

  return (
    <div className="flex flex-col gap-2">
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
        <SubmitButton
          variant="outline"
          className="w-40"
          disabled={!change || loading}
          loading={loading}
          onClick={handleSubmit}
        >
          Save
        </SubmitButton>
      </div>
    </div>
  );
}

export default ChangeRoleSection;

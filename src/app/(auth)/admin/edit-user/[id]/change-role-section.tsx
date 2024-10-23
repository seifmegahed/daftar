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
    description: "Has all privileges",
  },
  {
    label: "Super User",
    value: "s-user",
    description:
      "Same privileges as a regular user, but has access to all private data",
  },
  {
    label: "User",
    value: "user",
    description: "Regular user",
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
    try {
      setLoading(true);
      const [, error] = await adminUpdateUserRoleAction({
        id: userId,
        role: role,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Role updated");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the role");
    } finally {
      setLoading(false);
    }
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

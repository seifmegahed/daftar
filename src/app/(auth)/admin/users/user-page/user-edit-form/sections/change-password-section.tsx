"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LabelWrapper from "../label-wrapper";

function ChangePasswordSection({ userId }: { userId: number }) {
  return (
    <form autoComplete="off">
      <div className="flex flex-col gap-4 py-4">
        <LabelWrapper label="Password" />
        <div className="flex flex-col gap-4">
          <Label htmlFor="new">New Password</Label>
          <Input id="new" type="password" autoComplete="new-password" />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="verify">Verify Password</Label>
          <Input id="verify" type="password" />
        </div>
        <p className="text-xs text-muted-foreground">
          Change the password of the user, Password must be at least 8
          characters long and must contain at least one uppercase letter, one
          lowercase letter, one number and one special character.
          <br></br>
          <br></br>
          <strong>Note:</strong>
          <br></br>
          If you want to revoke the user's access you can deactivate their
          account below.
          <br></br>
          <br></br>
          Use this feature only if the user forgets their password. If the user
          just wants to change their password, they can do so from their user's
          settings page while logged in. They can find the settings page by
          clicking on their avatar in the top right corner of the application.
        </p>
        <div className="flex justify-end py-4">
          <Button variant="secondary" className="w-40">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChangePasswordSection;

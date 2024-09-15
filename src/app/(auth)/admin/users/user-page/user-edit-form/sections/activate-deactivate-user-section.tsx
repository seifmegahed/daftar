"use client";

import { Button } from "@/components/ui/button";
import LabelWrapper from "../label-wrapper";

function DeactivateUserSection({ userId }: { userId: number }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between py-4">
        <LabelWrapper label="Deactivate User" />
        <Button variant="destructive" className="w-40">
          Deactivate
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Deactivate the user, this will prevent the user from logging in and
        accessing the Application. Once deactivated the
        <strong> changes will take effect once the user logs out.</strong> If
        you want effect to take place immediately, you need to restart the
        server, better call the IT administrator.<br></br>The user will still
        appear in the list of users, but will not be able to login or access the
        application. You can reactivate the user at any time.
      </p>
    </div>
  );
}

function ActivateUserSection({ userId }: { userId: number }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <LabelWrapper label="Activate User" />
      <p className="text-xs text-muted-foreground">
        Activating the user will allow the user to login and access the
        Application.
      </p>
      <div className="flex justify-end py-4">
        <Button variant="outline" className="w-40">
          Activate
        </Button>
      </div>
    </div>
  );
}

const ActivateDeactivateUserSection = ({
  userId,
  userActive,
}: {
  userId: number;
  userActive: boolean;
}) =>
  userActive ? (
    <DeactivateUserSection userId={userId} />
  ) : (
    <ActivateUserSection userId={userId} />
  );

export default ActivateDeactivateUserSection;

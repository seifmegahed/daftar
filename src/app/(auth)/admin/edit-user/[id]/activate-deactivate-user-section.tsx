"use client";

import { useState } from "react";
import { toast } from "sonner";

import { adminUpdateUserActiveAction } from "@/server/actions/users";

import SubmitButton from "@/components/buttons/submit-button";
import LabelWrapper from "./label-wrapper";

function DeactivateUserSection({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const onsubmit = async () => {
    setLoading(true);
    const [response, error] = await adminUpdateUserActiveAction({
      id: userId,
      active: false,
    });
    setLoading(false);
    if (error !== null) return toast.error(error);
    toast.success(`User ID: ${response} deactivated`);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between py-4">
        <LabelWrapper label="Deactivate User" />
        <SubmitButton
          variant="destructive"
          loading={loading}
          onClick={onsubmit}
          disabled={loading}
        >
          Deactivate
        </SubmitButton>
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
  const [loading, setLoading] = useState(false);
  const onsubmit = async () => {
    setLoading(true);
    const [response, error] = await adminUpdateUserActiveAction({
      id: userId,
      active: true,
    });
    setLoading(false);
    if (error !== null) return toast.error(error);
    toast.success(`User ID: ${response} activated`);
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <LabelWrapper label="Activate User" />
      <p className="text-xs text-muted-foreground">
        This user is currently deactivated, this means that they are unable to
        access the application using their credentials. Activating the user will
        re-allow the user to login using their credentials and access the
        application.
      </p>
      <div className="flex justify-end py-4">
        <SubmitButton
          variant="destructive"
          loading={loading}
          onClick={onsubmit}
          disabled={loading}
        >
          Activate
        </SubmitButton>
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

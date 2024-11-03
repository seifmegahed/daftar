"use client";

import { useState } from "react";
import { toast } from "sonner";

import { adminUpdateUserActiveAction } from "@/server/actions/users";

import SubmitButton from "@/components/buttons/submit-button";
import LabelWrapper from "./label-wrapper";
import { useTranslations } from "next-intl";

function DeactivateUserSection({ userId }: { userId: number }) {
  const t = useTranslations("edit-user.deactivate-user-section");

  const [loading, setLoading] = useState(false);
  const onsubmit = async () => {
    try {
      setLoading(true);
      const [, error] = await adminUpdateUserActiveAction({
        id: userId,
        active: false,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between py-4">
        <LabelWrapper label={t("title")} />
        <SubmitButton
          variant="destructive"
          loading={loading}
          onClick={onsubmit}
          disabled={loading}
        >
          {t("deactivate")}
        </SubmitButton>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("description-a")}
        <strong>{t("description-b")}</strong>
        {t("description-c")}
        <br></br>
        {t("description-d")}
      </p>
    </div>
  );
}

function ActivateUserSection({ userId }: { userId: number }) {
  const t = useTranslations("edit-user.activate-user-section");

  const [loading, setLoading] = useState(false);
  const onsubmit = async () => {
    setLoading(true);
    try {
      const [, error] = await adminUpdateUserActiveAction({
        id: userId,
        active: true,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex justify-between py-4">
        <LabelWrapper label={t("title")} />
        <SubmitButton
          variant="outline"
          loading={loading}
          onClick={onsubmit}
          disabled={loading}
        >
          {t("activate")}
        </SubmitButton>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("description")}
      </p>
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

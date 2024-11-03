"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  adminUpdateUserEmailAction,
  userUpdateUserEmailAction,
} from "@/server/actions/users";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";
import { z } from "zod";
import { emptyToUndefined } from "@/utils/common";

function ChangeEmailSection({
  userId,
  email,
  type,
}: {
  userId: number;
  email: string;
  type: "admin" | "user";
}) {
  const t = useTranslations("edit-user.change-email-section");

  const schema = z.preprocess(
    emptyToUndefined,
    z
      .string({ required_error: t("email-required-message") })
      .email({ message: t("email-invalid-message") }).max(64, {
        message: t("email-max-length", { maxLength: 64 }),
      }),
  );

  const [newEmail, setNewEmail] = useState(email);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(email !== newEmail && newEmail !== "" ? true : false);
  }, [email, newEmail]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = schema.safeParse({ email: newEmail });
    if (!isValid.success) {
      setErrorMessage(isValid.error.message);
      setLoading(false);
      return;
    } else setErrorMessage("");
    try {
      const [, error] =
        type === "admin"
          ? await adminUpdateUserEmailAction({
              id: userId,
              email: newEmail,
            })
          : await userUpdateUserEmailAction({
              id: userId,
              email: newEmail,
            });
      setLoading(false);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelWrapper htmlFor="new-email" label={t("title")} />
      <Input
        id="new-email"
        placeholder={t("placeholder")}
        type="text"
        dir="ltr"
        value={newEmail}
        autoComplete="none"
        onChange={(event) => setNewEmail(event.target.value)}
        className={`${change ? "" : "!text-muted-foreground"}`}
      />
      {errorMessage !== "" ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {t("description")}
      </p>
      <div className="flex justify-end py-4">
        <SubmitButton
          disabled={!change || loading}
          loading={loading}
          onClick={onsubmit}
        >
          {t("update")}
        </SubmitButton>
      </div>
    </div>
  );
}

export default ChangeEmailSection;

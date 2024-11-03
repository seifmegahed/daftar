"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  adminUpdateUserPhoneNumberAction,
  userUpdateUserPhoneNumberAction,
} from "@/server/actions/users";
import { emptyToUndefined } from "@/utils/common";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";

function ChangePhoneNumberSection({
  userId,
  phoneNumber,
  type,
}: {
  userId: number;
  phoneNumber: string;
  type: "admin" | "user";
}) {
  const t = useTranslations("edit-user.change-phone-number-section");

  const schema = z.preprocess(
    emptyToUndefined,
    z
      .string({ required_error: t("phone-number-required-message") })
      .max(64, { message: t("phone-number-max-length", { maxLength: 64 }) }),
  );

  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(
      phoneNumber !== newPhoneNumber && newPhoneNumber !== "" ? true : false,
    );
  }, [phoneNumber, newPhoneNumber]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = schema.safeParse({ phoneNumber: newPhoneNumber });
    if (!isValid.success) {
      setErrorMessage(isValid.error.message);
      setLoading(false);
      return;
    } else setErrorMessage("");
    try {
      const [, error] =
        type === "admin"
          ? await adminUpdateUserPhoneNumberAction({
              id: userId,
              phoneNumber: newPhoneNumber,
            })
          : await userUpdateUserPhoneNumberAction({
              id: userId,
              phoneNumber: newPhoneNumber,
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
      <LabelWrapper htmlFor="new-phoneNumber" label={t("title")} />
      <Input
        id="new-phoneNumber"
        placeholder={t("placeholder")}
        type="text"
        dir="ltr"
        value={newPhoneNumber}
        autoComplete="none"
        onChange={(event) => setNewPhoneNumber(event.target.value)}
        className={`${change ? "" : "!text-muted-foreground"}`}
      />
      {errorMessage !== "" ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">{t("description")}</p>
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

export default ChangePhoneNumberSection;

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserSchema } from "@/server/db/tables/user/schema";
import { adminUpdateUserDisplayNameAction } from "@/server/actions/users";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/buttons/submit-button";

import LabelWrapper from "./label-wrapper";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { emptyToUndefined } from "@/utils/common";

function ChangeNameSection({ userId, name }: { userId: number; name: string }) {
  const t = useTranslations("edit-user.change-name-section");

  const changeNameSchema = z.preprocess(
    emptyToUndefined,
    z
      .string({ required_error: t("name-required-message") })
      .min(4, t("name-min-length", { minLength: 4 }))
      .max(64, t("name-max-length", { maxLength: 64 })),
  );

  const [newName, setNewName] = useState(name);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(name !== newName && newName !== "" ? true : false);
  }, [name, newName]);

  const onsubmit = async () => {
    setLoading(true);
    const isValid = changeNameSchema.safeParse({ name: newName });
    if (!isValid.success) {
      setErrorMessage(isValid.error.message);
      setLoading(false);
      return;
    } else setErrorMessage("");
    try {
      const [, error] = await adminUpdateUserDisplayNameAction({
        id: userId,
        name: newName,
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
      <LabelWrapper htmlFor="new-name" label={t("title")} />
      <Input
        id="new-name"
        placeholder={t("placeholder")}
        type="text"
        value={newName}
        autoComplete="none"
        onChange={(event) => setNewName(event.target.value)}
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

export default ChangeNameSection;

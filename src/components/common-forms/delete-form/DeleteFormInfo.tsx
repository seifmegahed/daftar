"use client";

import { useTranslations } from "next-intl";

function DeleteFormInfo({
  type,
}: {
  type: string;
}) {
  const t = useTranslations("delete-form.form-info");
  return (
    <>
      <span>
        {t("description", { type })}
      </span>
      <br />
      <strong>{t("warning")}</strong>
      <br />
      <span>
        {t("warning-content", {type})}
      </span>
      <br />
      <strong>{t("note")}</strong>
      <br />
      <span>
        {type === "project" || "مشروع" ? t("project-note-content") : t("note-content", {type})}
      </span>
    </>
  );
}

export default DeleteFormInfo;

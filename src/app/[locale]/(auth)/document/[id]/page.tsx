import UserInfoSection from "@/components/common-sections/user-info-section";
import DataDisplayUnit from "@/components/data-display-unit";
import ErrorPage from "@/components/error";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getDocumentByIdAction } from "@/server/actions/documents/read";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ItemPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("document.page");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [document, error] = await getDocumentByIdAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;

  const infoData = [
    { label: t("general-info-section.extension"), value: document.extension },
    {
      label: t("general-info-section.private"),
      value: document.private
        ? t("general-info-section.yes")
        : t("general-info-section.no"),
    },
  ];

  return (
    <InfoPageWrapper
      title={document.name}
      subtitle={t("subtitle", { documentName: document.name })}
    >
      <Section title={t("general-info")}>
        {infoData.map(({ label, value }) => (
          <DataDisplayUnit key={value} label={label} values={[value]} />
        ))}
        <div className="flex sm:justify-end">
          <Link href={`/api/download-document/${document.id}`}>
            <div className="flex cursor-pointer items-center gap-x-2 sm:text-right">
              <p className="hover:underline">{t("download")}</p>
              <DownloadIcon className="mb-1 h-4 w-4" />
            </div>
          </Link>
        </div>
      </Section>
      <Section title={t("other-info")}>
        <UserInfoSection data={document} />
      </Section>
      <Section title={t("notes")}>
        <div>
          <p>{document.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default ItemPage;

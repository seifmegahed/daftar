import UserInfoSection from "@/components/common-sections/user-info-section";
import DataDisplayUnit from "@/components/data-display-unit";
import ErrorPage from "@/components/error";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getItemDetailsAction } from "@/server/actions/items/read";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ItemPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("item.page");

  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message={t("invalid-id")} />;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;

  const infoData = [
    { label: t("general-info-section.type"), value: item.type },
    { label: t("general-info-section.description"), value: item.description },
    { label: t("general-info-section.mpn"), value: item.mpn },
    { label: t("general-info-section.make"), value: item.make },
  ];

  return (
    <InfoPageWrapper title={item.name} subtitle={t("subtitle", { itemName: item.name })}>
      <Section title={t("general-info")}>
        {infoData.map(({ label, value }) => (
          <DataDisplayUnit key={value} label={label} values={[value]} />
        ))}
      </Section>
      <Section title={t("other-info")}>
        <UserInfoSection data={item} />
      </Section>
      <Section title={t("notes")}>
        <div>
          <p>{item.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default ItemPage;

import { AppearanceForm } from "./appearance-form";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SettingsAppearancePage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  const t = await getTranslations("settings.preferences");
  return (
    <InfoPageWrapper title={t("title")} subtitle={t("description")}>
      <AppearanceForm />
    </InfoPageWrapper>
  );
}

export default SettingsAppearancePage;

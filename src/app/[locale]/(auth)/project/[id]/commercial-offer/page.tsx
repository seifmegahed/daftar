import ErrorPage from "@/components/error";
import GenerateOfferForm from "./form";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import type { LocaleParams } from "@/i18n/set-locale";

async function CommercialOffer({
  params,
}: {
  params: { id: string; locale: LocaleParams["locale"] };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.commercial-offer");
  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message={t("invalid-id")} />;

  const [access] = await hasAccessToPrivateDataAction();
  if (!access) return <ErrorPage message={t("unauthorized")} />;
  return <GenerateOfferForm projectId={id} />;
}

export default CommercialOffer;

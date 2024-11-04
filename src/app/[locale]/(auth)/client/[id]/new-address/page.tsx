import NewAddressForm from "@/components/common-forms/address-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { getLocaleType } from "@/utils/common";

async function NewAddressPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(params.locale);
  const localizedType = getLocaleType("client", locale);
  const t = await getTranslations("invalid-type-id");

  const clientId = parseInt(params.id);
  if (isNaN(clientId))
    return <ErrorPage message={t("message", { type: localizedType })} />;

  return <NewAddressForm id={clientId} type="client" />;
}

export default NewAddressPage;

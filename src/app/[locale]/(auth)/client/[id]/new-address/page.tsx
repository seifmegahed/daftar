import NewAddressForm from "@/components/common-forms/address-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function NewAddressPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("invalid-type-id");
  const clientId = parseInt(params.id);
  if (isNaN(clientId))
    return <ErrorPage message={t("message", { type: "client" })} />;
  return <NewAddressForm id={clientId} type="client" />;
}

export default NewAddressPage;

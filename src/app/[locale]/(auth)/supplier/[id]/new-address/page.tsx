import NewAddressForm from "@/components/common-forms/address-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getLocaleType } from "@/utils/common";
import { getTranslations } from "next-intl/server";

async function NewAddressPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const localizedType = getLocaleType("supplier", locale);
  const t = await getTranslations("invalid-type-id");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId))
    return <ErrorPage message={t("message", { type: localizedType })} />;

  return <NewAddressForm id={supplierId} type="supplier" />;
}

export default NewAddressPage;

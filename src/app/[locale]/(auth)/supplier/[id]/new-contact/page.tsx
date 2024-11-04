import NewContactForm from "@/components/common-forms/contact-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getLocaleType } from "@/utils/common";
import { getTranslations } from "next-intl/server";

async function NewContactPage({
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

  return <NewContactForm id={supplierId} type="supplier" />;
}

export default NewContactPage;

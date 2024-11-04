import NewContactForm from "@/components/common-forms/contact-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function NewContactPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("invalid-type-id");
  
  const clientId = parseInt(params.id);
  if (isNaN(clientId))
    return <ErrorPage message={t("message", { type: "client" })} />;

  return <NewContactForm id={clientId} type="client" />;
}

export default NewContactPage;

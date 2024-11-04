import { getClientFullByIdAction } from "@/server/actions/clients/read";
import Section from "@/components/info-section";
import ClientSection from "@/components/common-sections/company-section";
import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ClientPage({ params }: { params: { id: string, locale: Locale } }) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("client.page");
  
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message={t("invalid-id")} />;

  const [client, error] = await getClientFullByIdAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  
  return (
    <InfoPageWrapper
      title={client.name}
      subtitle={t("subtitle", { clientName: client.name })}
    >
      <Section title={t("general-info")}>
        <ClientSection data={client} type="client" />
      </Section>
      <Section title={t("other-info")}>
        <UserInfoSection data={client} />
      </Section>
      <Section title={t("notes")}>
        <div>
          <p>{client.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default ClientPage;

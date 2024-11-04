import ContactCard from "@/components/common-cards/contact";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getClientPrimaryContactIdAction } from "@/server/actions/clients/read";
import { getClientContactsAction } from "@/server/actions/contacts";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ClientContactsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("client.contacts");

  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message={t("invalid-id")} />;

  const [contacts, error] = await getClientContactsAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!contacts.length)
    return <ErrorPage title={t("no-contacts-found-error-message")} />;

  const [primaryContactId, primaryContactError] =
    await getClientPrimaryContactIdAction(clientId);
  if (primaryContactError !== null)
    return <ErrorPage message={primaryContactError} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          referenceId={clientId}
          referenceType="client"
          isPrimary={contact.id === primaryContactId}
        />
      ))}
    </ListPageWrapper>
  );
}

export default ClientContactsPage;

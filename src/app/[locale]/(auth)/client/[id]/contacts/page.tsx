import ContactCard from "@/components/common-cards/contact";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getClientPrimaryContactIdAction } from "@/server/actions/clients/read";
import { getClientContactsAction } from "@/server/actions/contacts";

async function ClientContactsPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid Client ID" />;

  const [contacts, error] = await getClientContactsAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!contacts.length)
    return (
      <ErrorPage title="There seems to be no contacts for this client yet" />
    );

  const [primaryContactId, primaryContactError] =
    await getClientPrimaryContactIdAction(clientId);
  if (primaryContactError !== null)
    return <ErrorPage message={primaryContactError} />;
  
  return (
    <ListPageWrapper
      title="Client's Contacts"
      subtitle="This is a list of the client's contacts."
    >
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

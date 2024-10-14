import ContactCard from "@/components/common-cards/contact";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getClientPrimaryContactIdAction } from "@/server/actions/clients/read";
import { getClientContactsAction } from "@/server/actions/contacts";

async function ClientContactsPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);

  if (isNaN(clientId)) return <p>Error: Client ID is not a number</p>;

  const [contacts, error] = await getClientContactsAction(clientId);
  if (error !== null) return <p>Error: {error}</p>;

  const [primaryContactId, primaryContactError] =
    await getClientPrimaryContactIdAction(clientId);
  if (primaryContactError !== null) {
    console.log(primaryContactError);
  }
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

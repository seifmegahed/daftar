import ContactCard from "@/components/common-cards/contact";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierContactsAction } from "@/server/actions/contacts";
import { getSupplierPrimaryContactIdAction } from "@/server/actions/suppliers/read";

async function SupplierContactsPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [contacts, error] = await getSupplierContactsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!contacts.length)
    return (
      <ErrorPage title="There seems to be no contacts for this supplier yet" />
    );

  const [primaryContactId, primaryContactError] =
    await getSupplierPrimaryContactIdAction(supplierId);
  if (primaryContactError !== null)
    return <ErrorPage message={primaryContactError} />;

  return (
    <ListPageWrapper
      title="Supplier's Contacts"
      subtitle="This is a list of the supplier's contacts."
    >
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          referenceId={supplierId}
          referenceType="supplier"
          isPrimary={contact.id === primaryContactId}
        />
      ))}
    </ListPageWrapper>
  );
}

export default SupplierContactsPage;

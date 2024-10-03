import ContactCard from "@/components/common-cards/contact";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getSupplierContactsAction } from "@/server/actions/contacts";
import { getSupplierPrimaryContactIdAction } from "@/server/actions/suppliers";

async function SupplierContactsPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Client ID is not a number</p>;

  const [contacts, error] = await getSupplierContactsAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;

  const [primaryContactId, primaryContactError] =
    await getSupplierPrimaryContactIdAction(supplierId);
  if (primaryContactError !== null) {
    console.log(primaryContactError);
  }
  return (
    <InfoPageWrapper
      title="Supplier's Contacts"
      subtitle="This is a list of the supplier's contacts."
    >
      <div className="flex flex-col gap-4">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            referenceId={supplierId}
            referenceType="supplier"
            isPrimary={contact.id === primaryContactId}
          />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default SupplierContactsPage;

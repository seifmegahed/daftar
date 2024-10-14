import { getClientAddressesAction } from "@/server/actions/addresses";
import { getClientPrimaryAddressIdAction } from "@/server/actions/clients/read";
import AddressCard from "@/components/common-cards/address";
import ListPageWrapper from "@/components/list-page-wrapper";

async function ClientAddressesPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);

  if (isNaN(clientId)) return <p>Error: Client ID is not a number</p>;

  const [addresses, error] = await getClientAddressesAction(clientId);
  if (error !== null) return <p>Error: {error}</p>;

  const [primaryAddressId, primaryAddressError] =
    await getClientPrimaryAddressIdAction(clientId);
  if (primaryAddressError !== null) {
    console.log(primaryAddressError);
  }

  return (
    <ListPageWrapper
      title="Client's Addresses"
      subtitle="This is a list of the client's addresses."
    >
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          referenceId={clientId}
          referenceType="client"
          isPrimary={address.id === primaryAddressId}
        />
      ))}
    </ListPageWrapper>
  );
}

export default ClientAddressesPage;

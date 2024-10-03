import InfoPageWrapper from "@/components/info-page-wrapper";
import { getClientAddressesAction } from "@/server/actions/addresses";
import { getClientPrimaryAddressIdAction } from "@/server/actions/clients";
import AddressCard from "./address-card";

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
    <InfoPageWrapper
      title="Client's Addresses"
      subtitle="This is a list of the client's addresses."
    >
      <div className="flex flex-col gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            referenceId={clientId}
            referenceType="client"
            isPrimary={address.id === primaryAddressId}
          />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default ClientAddressesPage;

import { getClientAddressesAction } from "@/server/actions/addresses";
import { getClientPrimaryAddressIdAction } from "@/server/actions/clients/read";
import AddressCard from "@/components/common-cards/address";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ClientAddressesPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid client ID" />;

  const [addresses, error] = await getClientAddressesAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!addresses.length)
    return (
      <ErrorPage title="There seems to be no addresses for this client yet" />
    );

  const [primaryAddressId, primaryAddressError] =
    await getClientPrimaryAddressIdAction(clientId);
  if (primaryAddressError !== null)
    return <ErrorPage message={primaryAddressError} />;

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

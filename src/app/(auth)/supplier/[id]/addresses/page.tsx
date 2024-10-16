import { getSupplierAddressesAction } from "@/server/actions/addresses";
import AddressCard from "@/components/common-cards/address";
import { getSupplierPrimaryAddressIdAction } from "@/server/actions/suppliers/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function SuppliersAddressesPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [addresses, error] = await getSupplierAddressesAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!addresses.length)
    return (
      <ErrorPage title="There seems to be no addresses for this supplier yet" />
    );

  const [primaryAddressId, primaryAddressError] =
    await getSupplierPrimaryAddressIdAction(supplierId);
  if (primaryAddressError !== null)
    return <ErrorPage message={primaryAddressError} />;

  return (
    <ListPageWrapper
      title="Supplier's Addresses"
      subtitle="This is a list of the supplier's addresses."
    >
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          referenceId={supplierId}
          referenceType="supplier"
          isPrimary={address.id === primaryAddressId}
        />
      ))}
    </ListPageWrapper>
  );
}

export default SuppliersAddressesPage;

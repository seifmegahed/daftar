import InfoPageWrapper from "@/components/info-page-wrapper";
import { getSupplierAddressesAction } from "@/server/actions/addresses";
import AddressCard from "@/components/common-cards/address";
import { getSupplierPrimaryAddressIdAction } from "@/server/actions/suppliers";

async function SuppliersAddressesPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [addresses, error] = await getSupplierAddressesAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;

  const [primaryAddressId, primaryAddressError] =
    await getSupplierPrimaryAddressIdAction(supplierId);
  if (primaryAddressError !== null) {
    console.log(primaryAddressError);
  }

  return (
    <InfoPageWrapper
      title="Supplier's Addresses"
      subtitle="This is a list of the supplier's addresses."
    >
      <div className="flex flex-col gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            referenceId={supplierId}
            referenceType="supplier"
            isPrimary={address.id === primaryAddressId}
          />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default SuppliersAddressesPage;

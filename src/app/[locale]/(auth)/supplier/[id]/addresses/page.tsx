import { getSupplierAddressesAction } from "@/server/actions/addresses";
import AddressCard from "@/components/common-cards/address";
import { getSupplierPrimaryAddressIdAction } from "@/server/actions/suppliers/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SuppliersAddressesPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.addresses");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [addresses, error] = await getSupplierAddressesAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!addresses.length)
    return <ErrorPage title={t("no-addresses-found-error-message")} />;

  const [primaryAddressId, primaryAddressError] =
    await getSupplierPrimaryAddressIdAction(supplierId);
  if (primaryAddressError !== null)
    return <ErrorPage message={primaryAddressError} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
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

import { getClientAddressesAction } from "@/server/actions/addresses";
import { getClientPrimaryAddressIdAction } from "@/server/actions/clients/read";
import AddressCard from "@/components/common-cards/address";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ClientAddressesPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("client.addresses");
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message={t("invalid-id")} />;

  const [addresses, error] = await getClientAddressesAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!addresses.length)
    return <ErrorPage title={t("no-addresses-found-error-message")} />;

  const [primaryAddressId, primaryAddressError] =
    await getClientPrimaryAddressIdAction(clientId);
  if (primaryAddressError !== null)
    return <ErrorPage message={primaryAddressError} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
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

import ContactCard from "@/components/common-cards/contact";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierContactsAction } from "@/server/actions/contacts";
import { getSupplierPrimaryContactIdAction } from "@/server/actions/suppliers/read";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SupplierContactsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.contacts");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [contacts, error] = await getSupplierContactsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!contacts.length)
    return <ErrorPage title={t("no-contacts-found-error-message")} />;

  const [primaryContactId, primaryContactError] =
    await getSupplierPrimaryContactIdAction(supplierId);
  if (primaryContactError !== null)
    return <ErrorPage message={primaryContactError} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
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

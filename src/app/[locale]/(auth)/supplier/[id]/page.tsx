import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getSupplierFullByIdAction } from "@/server/actions/suppliers/read";
import SupplierSection from "@/components/common-sections/company-section";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SupplierPage({ params }: { params: { id: string; locale: Locale } }) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.page");

  const supplierId = parseInt(params.id);
    if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [supplier, error] = await getSupplierFullByIdAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  
  return (
    <InfoPageWrapper
      title={supplier.name}
      subtitle={t("subtitle", { supplierName: supplier.name })}
    >
      <Section title={t("general-info")}>
        <SupplierSection data={supplier} type="supplier" />
      </Section>
      <Section title={t("other-info")}>
        <UserInfoSection data={supplier} />
      </Section>
      <Section title={t("notes")}>
        <div>
          <p>{supplier.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default SupplierPage;

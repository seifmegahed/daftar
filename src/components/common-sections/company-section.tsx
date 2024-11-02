import { getTranslations } from "next-intl/server";
import DataDisplayUnit from "../data-display-unit";

const CompanySection = async ({
  data,
}: {
  data: {
    id: number;
    name: string;
    field?: string;
    registrationNumber: string | null;
    website: string | null;
    primaryAddress: {
      id: number;
      addressLine: string;
      city: string | null;
      country: string;
    } | null;
    primaryContact: {
      id: number;
      name: string;
      email: string | null;
      phoneNumber: string | null;
    } | null;
  };
  type: "client" | "supplier";
}) => {
  const {
    name,
    field,
    registrationNumber,
    website,
    primaryAddress,
    primaryContact,
  } = data;
  const t = await getTranslations("company-section");
  return (
    <>
      <DataDisplayUnit label={t("name")} values={[name]} />
      {field ? <DataDisplayUnit label={t("field")} values={[field]} /> : null}
      {registrationNumber ? (
        <DataDisplayUnit
          label={t("registration-number")}
          values={[registrationNumber]}
        />
      ) : null}
      {website ? (
        <DataDisplayUnit label={t("website")} values={[website]} />
      ) : null}
      {primaryAddress ? (
        <DataDisplayUnit
          label={t("address")}
          values={[
            primaryAddress.addressLine,
            primaryAddress.city
              ? `${primaryAddress.city}, ${primaryAddress.country}`
              : primaryAddress.country,
          ]}
        />
      ) : null}
      {primaryContact ? (
        <DataDisplayUnit
          label={t("contact")}
          values={[
            primaryContact.name,
            primaryContact.email,
            primaryContact.phoneNumber,
          ]}
        />
      ) : null}
    </>
  );
};

export default CompanySection;

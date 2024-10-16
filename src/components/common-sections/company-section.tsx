import DataDisplayUnit from "../data-display-unit";

const CompanySection = ({
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
  return (
    <>
      <DataDisplayUnit label="Name" values={[name]} />
      {field ? (
        <DataDisplayUnit label="Field of Business" values={[field]} />
      ) : null}
      {registrationNumber ? (
        <DataDisplayUnit
          label="Registration Number"
          values={[registrationNumber]}
        />
      ) : null}
      {website ? <DataDisplayUnit label="Website" values={[website]} /> : null}
      {primaryAddress ? (
        <DataDisplayUnit
          label="Address"
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
          label="Contact"
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

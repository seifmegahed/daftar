import Link from "next/link";

const CompanySection = ({
  data,
  type,
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
    id,
    name,
    field,
    registrationNumber,
    website,
    primaryAddress,
    primaryContact,
  } = data;
  return (
    <>
      <div className="flex justify-between">
        <p>Name</p>
        <Link href={`/${type}/${id}`} className="text-blue-400 hover:underline">
          {name}
        </Link>
      </div>
      {field ? (
        <div className="flex justify-between">
          <p>Field of Business</p>
          <p>{field}</p>
        </div>
      ) : null}
      {registrationNumber ? (
        <div className="flex justify-between">
          <p>Registration Number</p>
          <p>{registrationNumber}</p>
        </div>
      ) : null}
      {website ? (
        <div className="flex justify-between">
          <p>Website</p>
          <Link
            href={"https://" + website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            {website}
          </Link>
        </div>
      ) : null}
      {primaryAddress ? (
        <div className="flex justify-between text-right">
          <p>Address</p>
          <div>
            <p>{primaryAddress.addressLine}</p>
            <p>
              {primaryAddress.city ? primaryAddress.city + ", " : ""}
              {primaryAddress.country}
            </p>
          </div>
        </div>
      ) : null}
      {primaryContact ? (
        <div className="flex justify-between text-right">
          <p>Contact</p>
          <div>
            <p>{primaryContact.name}</p>
            {primaryContact.email ? (
              <Link
                className="text-blue-400 hover:underline"
                href={"mailto:" + primaryContact.email}
              >
                {primaryContact.email}
              </Link>
            ) : null}
            {primaryContact.phoneNumber ? (
              <p>{primaryContact.phoneNumber}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CompanySection;

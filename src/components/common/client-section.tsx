import { type ProjectClientType } from "@/server/db/tables/project/queries";
import Link from "next/link";

const ClientSection = ({ client }: { client: ProjectClientType }) => {
  const { name, registrationNumber, website, primaryAddress, primaryContact } =
    client;
  return (
    <>
      <div className="flex justify-between">
        <p>Name</p>
        <Link
          href={`/client/${client.id}`}
          className="text-blue-400 hover:underline"
        >
          {name}
        </Link>
      </div>
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

export default ClientSection;

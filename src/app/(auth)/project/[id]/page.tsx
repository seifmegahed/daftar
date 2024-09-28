import { Separator } from "@/components/ui/separator";
import { getCurrencyLabel, getStatusLabel } from "@/data/lut";
import {
  getProjectByIdAction,
  getProjectLinkedDocumentsAction,
} from "@/server/actions/projects";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import { numberWithCommas } from "@/utils/common";
import { format } from "date-fns";
import { MoreHorizontal, FileIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ProjectPage({ params }: { params: { id: string } }) {
  const [project, projectErrors] = await getProjectByIdAction(
    Number(params.id),
  );
  if (projectErrors !== null) return <p>projectErrors: {projectErrors}</p>;
  const [documents] = await getProjectLinkedDocumentsAction(project.id);
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
      <Separator />
      <p className="text-muted-foreground">
        This is the project page for {project.name}. Here you can view all
        information about the project. You can also view the documents and items
        linked to this project. <br />
        You can use this page to enter journal entries for the project.
      </p>
      <Section title="Description">
        <p>{project.description}</p>
      </Section>
      <Section title="Status">
        <div className="flex justify-end">
          <p>{getStatusLabel(project.status)}</p>
        </div>
      </Section>
      <Section title="Client">
        <ClientSection client={project.client} />
      </Section>
      <Section title="General Info">
        <div className="flex justify-between">
          <p>Owner</p>
          <p> {project.owner.name}</p>
        </div>
        <div className="flex justify-between">
          <p>Start Date</p>
          <p>
            {project.startDate
              ? format(new Date(project.startDate), "PP")
              : "N/A"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>End Date</p>
          <p>
            {project.endDate ? format(new Date(project.endDate), "PP") : "N/A"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Created By</p>
          <p>{project.creator.name}</p>
        </div>
        <div className="flex justify-between">
          <p>Created At</p>
          <p>{format(project.createdAt, "PP")}</p>
        </div>
      </Section>
      <Section title="Notes">
        <div>
          <p>{project.notes}</p>
        </div>
      </Section>
      <Section title="Items">
        <ProjectItems items={project.items} />
      </Section>
      <Section title="Documents">
        {documents === null ? (
          <p>Error getting project documents.</p>
        ) : (
          <ProjectDocuments documents={documents} />
        )}
      </Section>
    </div>
  );
}

const ProjectDocuments = ({
  documents,
}: {
  documents: {
    projectDocuments: SimpDoc[];
    clientDocuments: SimpDoc[];
    itemsDocuments: SimpDoc[];
    suppliersDocuments: SimpDoc[];
  };
}) => {
  return (
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      <DocumentsDisplay
        documents={documents.projectDocuments}
        title="Project's Documents"
      />
      <DocumentsDisplay
        documents={documents.clientDocuments}
        title="Client's Documents"
      />
      <DocumentsDisplay
        documents={documents.itemsDocuments}
        title="Items' Documents"
      />
      <DocumentsDisplay
        documents={documents.suppliersDocuments}
        title="Suppliers' Documents"
      />
    </div>
  );
};

const DocumentsDisplay = ({
  documents,
  title,
}: {
  documents: SimpDoc[];
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      <h3 className="font-bold">{title}</h3>
      {documents.map((document) => (
        <DocumentCard document={document} key={document.id} />
      ))}
    </div>
  );
};

const DocumentCard = ({ document }: { document: SimpDoc }) => {
  return (
    <div className="flex justify-between pl-5">
      <div className="flex items-center gap-x-2">
        <div className="relative cursor-pointer">
          <FileIcon className="h-8 w-8" />
          <p className="absolute top-3 left-2 text-center w-4 font-medium text-[6pt] select-none">
            {document.extension}
          </p>
        </div>
        <p className="underline cursor-pointer">{document.name}</p>
      </div>
      <div className="flex rounded-full p-2 hover:bg-muted">
        <MoreHorizontal className="h-4 w-4" />
      </div>
    </div>
  );
};

const ProjectItems = ({
  items,
}: {
  items: {
    id: number;
    quantity: number;
    price: string;
    currency: number;
    item: { id: number; name: string; make: string | null; mpn: string | null };
    supplier: { id: number; name: string };
  }[];
}) => {
  return (
    <table className="w-full text-left text-sm text-muted-foreground">
      <thead>
        <tr className="h-12 text-left">
          <th className="pl-4">Item</th>
          <th>Supplier</th>
          <th className="text-right">Quantity</th>
          <th className="text-right">Price</th>
          <th className="text-right">Total</th>
          <th className="pr-4 text-right">Currency</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="h-12 odd:bg-muted">
            <td className="pl-4">
              <Link
                href={`/item/${item.item.id}`}
                className="text-blue-400 hover:underline"
              >
                {item.item.name}
              </Link>
            </td>
            <td>
              <Link
                href={`/supplier/${item.supplier.id}`}
                className="text-blue-400 hover:underline"
              >
                {item.supplier.name}
              </Link>
            </td>
            <td className="text-right">{item.quantity}</td>
            <td className="text-right">
              {numberWithCommas(Number(item.price))}
            </td>
            <td className="text-right">
              {numberWithCommas(Number(item.price) * item.quantity)}
            </td>
            <td className="pr-4 text-right">
              {getCurrencyLabel(item.currency)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ClientSection = ({
  client,
}: {
  client: {
    id: number;
    name: string;
    registrationNumber: string | null;
    website: string | null;
    address: {
      id: number;
      addressLine: string;
      city: string | null;
      country: string;
    } | null;
    contact: {
      id: number;
      name: string;
      email: string | null;
      phoneNumber: string | null;
    } | null;
  };
}) => {
  const { name, registrationNumber, website, address, contact } = client;
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
      {address ? (
        <div className="flex justify-between text-right">
          <p>Address</p>
          <div>
            <p>{address.addressLine}</p>
            <p>
              {address.city ? address.city + ", " : ""}
              {address.country}
            </p>
          </div>
        </div>
      ) : null}
      {contact ? (
        <div className="flex justify-between text-right">
          <p>Contact</p>
          <div>
            <p>{contact.name}</p>
            {contact.email ? (
              <Link
                className="text-blue-400 hover:underline"
                href={"mailto:" + contact.email}
              >
                {contact.email}
              </Link>
            ) : null}
            {contact.phoneNumber ? <p>{contact.phoneNumber}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    <Separator />
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      {children}
    </div>
  </>
);

export default ProjectPage;

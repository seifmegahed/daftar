import { Separator } from "@/components/ui/separator";
import { getCurrencyLabel, getStatusLabel } from "@/data/lut";
import {
  getProjectByIdAction,
  getProjectLinkedDocumentsAction,
} from "@/server/actions/projects";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import { type ProjectClientType } from "@/server/db/tables/project/queries";
import { numberWithCommas } from "@/utils/common";
import { format } from "date-fns";
import Link from "next/link";
import DocumentCard from "./document-card";
import { DownloadIcon } from "lucide-react";

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
          <ProjectDocuments id={project.id} documents={documents} />
        )}
      </Section>
    </div>
  );
}

const ProjectDocuments = ({
  id,
  documents,
}: {
  id: number;
  documents: {
    projectDocuments: SimpDoc[];
    clientDocuments: SimpDoc[];
    itemsDocuments: SimpDoc[];
    suppliersDocuments: SimpDoc[];
  };
}) => {
  return (
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      {documents.projectDocuments.length === 0 &&
      documents.clientDocuments.length === 0 &&
      documents.itemsDocuments.length === 0 &&
      documents.suppliersDocuments.length === 0 ? null : (
        <DocumentsDisplay
          documents={documents.projectDocuments}
          title="Project's Documents"
        />
      )}
      <DownloadAllDocumentsButton id={id} />
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

const DownloadAllDocumentsButton = ({ id }: { id: number }) => {
  return (
    <div className="flex justify-end">
      <Link
        href={`/api/project/download/${id}`}
        className="flex cursor-pointer items-center gap-x-2 hover:underline"
      >
        <p className="ml-2 text-sm text-muted-foreground">Download all</p>
        <DownloadIcon className="h-4 w-4" />
      </Link>
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
  if (documents.length === 0) return null;
  return (
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      <h3 className="font-bold">{title}</h3>
      {documents.map((document) => (
        <DocumentCard document={document} key={document.id} />
      ))}
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
    <table className="w-full text-left text-xs text-muted-foreground">
      <thead>
        <tr className="h-12 text-left">
          <th className="pl-4">Item</th>
          <th>Supplier</th>
          <th className="text-right">Quantity</th>
          <th className="text-right">Price</th>
          <th className="text-right">Total</th>
          <th className="pr-4 text-right">Cur</th>
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

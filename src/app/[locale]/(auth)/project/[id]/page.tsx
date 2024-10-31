import { getProjectTypeLabel, getStatusLabel } from "@/data/lut";
import {
  getProjectByIdAction,
  getProjectLinkedDocumentsAction,
} from "@/server/actions/projects/read";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import { format } from "date-fns";
import Link from "next/link";
import DocumentCard from "@/components/common-cards/document";
import { DownloadIcon } from "lucide-react";
import Section from "@/components/info-section";
import ClientSection from "@/components/common-sections/company-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import UserInfoSection from "@/components/common-sections/user-info-section";
import ErrorPage from "@/components/error";
import DataDisplayUnit from "@/components/data-display-unit";

async function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [project, error] = await getProjectByIdAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;

  const [documents, linkedDocumentsError] = await getProjectLinkedDocumentsAction(projectId);
  if (linkedDocumentsError !== null) return <ErrorPage message={linkedDocumentsError} />;

  return (
    <InfoPageWrapper
      title={project.name}
      subtitle={`This is the project page for ${project.name}. Here you can view all
        information about the project. You can also view the documents and items
        linked to this project.`}
    >
      {project.description && (
        <Section title="Description">
          <p>{project.description}</p>
        </Section>
      )}
      <Section title="Status">
        <div className="flex sm:justify-end">
          <p>{getStatusLabel(project.status)}</p>
        </div>
      </Section>
      <Section title="Client">
        <ClientSection data={project.client} type="client" />
      </Section>
      <Section title="General Info">
        <DataDisplayUnit
          label="Type"
          values={[getProjectTypeLabel(project.type)]}
        />
        <DataDisplayUnit label="Owner" values={[project.owner.name]} />
        <DataDisplayUnit
          label="Start Date"
          values={[
            project.startDate
              ? format(new Date(project.startDate), "PP")
              : "N/A",
          ]}
        />
        <DataDisplayUnit
          label="End Date"
          values={[
            project.endDate ? format(new Date(project.endDate), "PP") : "N/A",
          ]}
        />
      </Section>
      <Section title="Other Info">
        <UserInfoSection data={project} />
      </Section>
      {project.notes && (
        <Section title="Notes">
          <div>
            <p>{project.notes}</p>
          </div>
        </Section>
      )}
      {documents && (
        <Section title="Documents">
          <ProjectDocuments id={project.id} documents={documents} />
        </Section>
      )}
    </InfoPageWrapper>
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

export default ProjectPage;

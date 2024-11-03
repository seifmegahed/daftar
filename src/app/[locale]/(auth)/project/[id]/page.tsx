import {
  getLocalizedProjectTypeLabel,
  getLocalizedStatusLabel,
} from "@/data/lut";
import {
  getProjectByIdAction,
  getProjectLinkedDocumentsAction,
} from "@/server/actions/projects/read";
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
import { getTranslations } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";
import { setLocale } from "@/i18n/set-locale";

import type { SimpDoc } from "@/server/db/tables/document/queries";

async function ProjectPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  
  const t = await getTranslations("project.page");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  const [project, error] = await getProjectByIdAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;

  const [documents, linkedDocumentsError] =
    await getProjectLinkedDocumentsAction(projectId);
  if (linkedDocumentsError !== null)
    return <ErrorPage message={linkedDocumentsError} />;

  const localeDateFormat = getDateLocaleFormat(locale);

  return (
    <InfoPageWrapper
      title={project.name}
      subtitle={t("subtitle", { projectName: project.name })}
    >
      {project.description && (
        <Section title={t("description")}>
          <p>{project.description}</p>
        </Section>
      )}
      <Section title={t("status")}>
        <div className="flex sm:justify-end">
          <p>{getLocalizedStatusLabel(project.status, locale)}</p>
        </div>
      </Section>
      <Section title={t("client")}>
        <ClientSection data={project.client} type="client" />
      </Section>
      <Section title={t("general-info")}>
        <DataDisplayUnit
          label={t("type")}
          values={[getLocalizedProjectTypeLabel(project.type, locale)]}
        />
        <DataDisplayUnit label={t("owner")} values={[project.owner.name]} />
        <DataDisplayUnit
          label={t("start-date")}
          values={[
            project.startDate
              ? format(new Date(project.startDate), "PP", {
                  locale: localeDateFormat,
                })
              : t("not-available"),
          ]}
        />
        <DataDisplayUnit
          label={t("end-date")}
          values={[
            project.endDate
              ? format(new Date(project.endDate), "PP", {
                  locale: localeDateFormat,
                })
              : t("not-available"),
          ]}
        />
      </Section>
      <Section title={t("other-info")}>
        <UserInfoSection data={project} />
      </Section>
      {project.notes && (
        <Section title={t("notes")}>
          <div>
            <p>{project.notes}</p>
          </div>
        </Section>
      )}
      {documents && (
        <Section title={t("documents")}>
          <ProjectDocuments id={project.id} documents={documents} />
        </Section>
      )}
    </InfoPageWrapper>
  );
}

const ProjectDocuments = async ({
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
  const t = await getTranslations("project.project-documents-section");
  return (
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      <DownloadAllDocumentsButton id={id} label={t("download-all")} />
      <DocumentsDisplay
        documents={documents.projectDocuments}
        title={t("project-documents")}
      />
      <DocumentsDisplay
        documents={documents.clientDocuments}
        title={t("client-documents")}
      />
      <DocumentsDisplay
        documents={documents.itemsDocuments}
        title={t("items-documents")}
      />
      <DocumentsDisplay
        documents={documents.suppliersDocuments}
        title={t("suppliers-documents")}
      />
    </div>
  );
};

const DownloadAllDocumentsButton = ({
  id,
  label,
}: {
  id: number;
  label: string;
}) => {
  return (
    <div className="flex justify-end">
      <Link
        href={`/api/project/download/${id}`}
        className="flex cursor-pointer items-center gap-x-2 hover:underline"
      >
        <p className="ml-2 text-sm text-muted-foreground">{label}</p>
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

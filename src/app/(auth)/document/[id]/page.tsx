import UserInfoSection from "@/components/common-sections/user-info-section";
import DataDisplayUnit from "@/components/data-display-unit";
import ErrorPage from "@/components/error";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getDocumentByIdAction } from "@/server/actions/documents/read";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";

async function ItemPage({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message="Invalid document Id" />;

  const [document, error] = await getDocumentByIdAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <InfoPageWrapper
      title="Document"
      subtitle={`This is the page for the document: ${document.name}. Here you can view all information about the document.`}
    >
      <Section title="General Info">
        <DataDisplayUnit label="Name" values={[document.name]} />
        <DataDisplayUnit label="Extension" values={[document.extension]} />
        <DataDisplayUnit
          label="Private"
          values={[document.private ? "Yes" : "No"]}
        />
        <div className="flex sm:justify-end">
          <Link href={`/api/download-document/${document.id}`}>
            <div className="flex cursor-pointer items-center gap-x-2 sm:text-right">
              <p className="hover:underline">Download</p>
              <DownloadIcon className="mb-1 h-4 w-4" />
            </div>
          </Link>
        </div>
      </Section>
      <Section title="Other Info">
        <UserInfoSection data={document} />
      </Section>
      <Section title="Notes">
        <div>
          <p>{document.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default ItemPage;

import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getDocumentByIdAction } from "@/server/actions/documents/read";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";

async function ItemPage({ params }: { params: { id: string } }) {
  const [document, error] = await getDocumentByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Document"
      subtitle={`This is the page for the document: ${document.name}. Here you can view all information about the document.`}
    >
      <Section title="General Info">
        <div className="flex justify-between">
          <p>Name</p>
          <p>{document.name}</p>
        </div>
        <div className="flex justify-between">
          <p>Extension</p>
          <p>{document.extension}</p>
        </div>
        <div className="flex justify-end">
          <Link href={`/api/download-document/${document.id}`}>
            <div className="flex cursor-pointer items-center gap-x-2 text-right">
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

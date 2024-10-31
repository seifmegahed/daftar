import { type BriefDocumentType } from "@/server/db/tables/document/queries";
import DocumentCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardCreatedAtSection,
  CardIdSection,
  CardMenuContainer,
  CardNameSection,
  CardSection,
  CardSubtitleSection,
} from "@/components/card-sections";

const DocumentCard = ({ document }: { document: BriefDocumentType }) => {
  return (
    <CardWrapper>
      <CardIdSection href={`/document/${document.id}`} id={document.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={document.name}
            href={`/document/${document.id}`}
          />
          <CardSubtitleSection
            subtitle={document.private ? "Private" : "Public"}
            tip="Privacy"
          />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection text={document.extension} tip="Extension" />
          <CardCreatedAtSection date={document.createdAt} />
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <DocumentCardContextMenu documentId={document.id} />
      </CardMenuContainer>
    </CardWrapper>
  );
};

export default DocumentCard;

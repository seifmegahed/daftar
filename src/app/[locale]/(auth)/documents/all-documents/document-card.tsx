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
import { getTranslations } from "next-intl/server";

const DocumentCard = async ({ document }: { document: BriefDocumentType }) => {
  const t = await getTranslations("document-card.tips");
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
            tip={t("private")}
          />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection text={document.extension} tip={t("extension")} />
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

import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import NewDocumentForm from "./new-document-form";
import ExistingDocumentForm from "./existing-document-form";
import { getDocumentOptionsAction } from "@/server/actions/documents/read";
import { getTranslations, getLocale } from "next-intl/server";
import { getDirection } from "@/utils/common";
import ErrorPage from "@/components/error";

export type RelationDataType = {
  relationTo: "client" | "supplier" | "project" | "item";
  relationId: number;
};

export type GeneratedRelationType =
  | {
      clientId: number;
      supplierId: null;
      projectId: null;
      itemId: null;
    }
  | {
      clientId: null;
      supplierId: number;
      projectId: null;
      itemId: null;
    }
  | {
      clientId: null;
      supplierId: null;
      projectId: number;
      itemId: null;
    }
  | {
      clientId: null;
      supplierId: null;
      projectId: null;
      itemId: number;
    };

function generateRelation(relation: RelationDataType, errorMessage: string) {
  const { relationTo, relationId } = relation;
  switch (relationTo) {
    case "client":
      return {
        clientId: relationId,
        supplierId: null,
        projectId: null,
        itemId: null,
      };
    case "supplier":
      return {
        supplierId: relationId,
        clientId: null,
        projectId: null,
        itemId: null,
      };
    case "project":
      return {
        projectId: relationId,
        clientId: null,
        supplierId: null,
        itemId: null,
      };
    case "item":
      return {
        itemId: relationId,
        clientId: null,
        supplierId: null,
        projectId: null,
      };
    default:
      throw new Error(errorMessage);
  }
}

async function DocumentForm({
  relationData,
}: {
  relationData?: RelationDataType;
}) {
  const locale = await getLocale();
  const direction = getDirection(locale);
  const t = await getTranslations("document-form");

  if (!relationData) return <NewDocumentForm />;

  let relation: GeneratedRelationType;
  try {
    relation = generateRelation(relationData, t("invalid-relation"));
  } catch (error) {
    console.log(error);
    return <ErrorPage message={t("invalid-relation")} />;
  }

  const [documents, documentsError] = await getDocumentOptionsAction();
  if (documentsError !== null)
    return <NewDocumentForm generatedRelation={relation} />;

  return (
    <Tabs defaultValue="existing" dir={direction}>
      <TabsList className="h-12">
        <TabsTrigger value="existing" className="h-10 w-48">
          {t("existing-document")}
        </TabsTrigger>
        <TabsTrigger value="new" className="h-10 w-48">
          {t("new-document")}
        </TabsTrigger>
      </TabsList>
      <div className="p-2">
        <TabsContent value="new">
          <NewDocumentForm generatedRelation={relation} />
        </TabsContent>
        <TabsContent value="existing">
          <ExistingDocumentForm
            documents={documents}
            generatedRelation={relation}
            relationData={relationData}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default DocumentForm;

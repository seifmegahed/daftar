import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import NewDocumentForm from "./new-document-form";
import ExistingDocumentForm from "./existing-document-form";
import { getDocumentOptionsAction } from "@/server/actions/documents/read";
import { GenerateOfferForm } from "./generate-offer-form";

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

function generateRelation(relation: RelationDataType) {
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
      throw new Error("Invalid relation type");
  }
}

async function DocumentForm({
  relationData,
}: {
  relationData?: RelationDataType;
}) {
  if (!relationData) return <NewDocumentForm />;

  const relation = generateRelation(relationData);
  const [documents, documentsError] = await getDocumentOptionsAction();
  if (documentsError !== null) return <NewDocumentForm />;

  return (
    <Tabs defaultValue="existing" dir="ltr">
      <TabsList className="h-12">
        <TabsTrigger value="existing" className="h-10 w-48">
          Existing Document
        </TabsTrigger>
        <TabsTrigger value="new" className="h-10 w-48">
          New Document
        </TabsTrigger>
        {relationData.relationTo === "project" && (
          <TabsTrigger value="generate" className="h-10 w-48">
            Generate Offer
          </TabsTrigger>
        )}
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
        {relationData.relationTo === "project" && (
          <TabsContent value="generate">
            <GenerateOfferForm />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}

export default DocumentForm;

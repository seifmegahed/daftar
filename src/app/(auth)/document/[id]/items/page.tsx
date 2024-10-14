import { getDocumentItemsAction } from "@/server/actions/document-relations/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ItemCard from "../../../items/all-items/item-card";

async function DocumentItemsPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [items, error] = await getDocumentItemsAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Document's Items"
      subtitle="This is a list of the items that reference this document."
    >
        {items.map((client) => (
          <ItemCard key={client.id} item={client} />
        ))}
    </ListPageWrapper>
  );
}

export default DocumentItemsPage;

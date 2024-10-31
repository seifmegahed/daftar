import { getDocumentItemsAction } from "@/server/actions/document-relations/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ItemCard from "../../../items/all-items/item-card";
import ErrorPage from "@/components/error";

async function DocumentItemsPage({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message="Invalid document Id" />;

  const [items, error] = await getDocumentItemsAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length)
    return (
      <ErrorPage title="There seems to be no items linked to this document yet" />
    );

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

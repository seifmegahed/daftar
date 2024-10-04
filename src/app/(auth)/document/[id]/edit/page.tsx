import NameForm from "@/components/common-forms/update-name-form";
import NotesForm from "@/components/common-forms/update-notes-form";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getDocumentByIdAction } from "@/server/actions/documents/read";
import {
  updateDocumentNameAction,
  updateDocumentNotesAction,
} from "@/server/actions/documents/update";
import { getCurrentUserAction } from "@/server/actions/users";
import DeleteDocumentForm from "./delete-document-form";
import { getDocumentRelationsCountAction } from "@/server/actions/document-relations/read";

async function EditDocumentPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [document, error] = await getDocumentByIdAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [numberOfReferences, numberOfReferencesError] =
    await getDocumentRelationsCountAction(documentId);

  return (
    <InfoPageWrapper
      title="Edit Document"
      subtitle={`This is the edit page for the document: ${document.name}. Here you can edit the document details.`}
    >
      <NameForm
        id={documentId}
        updateCallbackAction={updateDocumentNameAction}
        type="document"
        access={hasFullAccess}
        name={document.name}
      />
      <NotesForm
        id={documentId}
        updateCallbackAction={updateDocumentNotesAction}
        notes={document.notes ?? ""}
        type="document"
      />
      {numberOfReferencesError === null && (
        <DeleteDocumentForm
          documentId={documentId}
          name={document.name}
          access={hasFullAccess}
          numberOfReferences={numberOfReferences}
        />
      )}
    </InfoPageWrapper>
  );
}

export default EditDocumentPage;

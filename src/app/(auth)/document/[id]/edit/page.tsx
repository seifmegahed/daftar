import NameForm from "@/components/common-forms/update-name-form";
import NotesForm from "@/components/common-forms/update-notes-form";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getDocumentByIdAction } from "@/server/actions/documents/read";
import {
  updateDocumentNameAction,
  updateDocumentNotesAction,
} from "@/server/actions/documents/update";
import { getCurrentUserAction } from "@/server/actions/users";
import { getDocumentRelationsCountAction } from "@/server/actions/document-relations/read";
import DeleteForm from "@/components/common-forms/delete-form";
import { deleteDocumentAction } from "@/server/actions/documents/delete";
import DeleteFormInfo from "@/components/common-forms/delete-form/DeleteFormInfo";

async function EditDocumentPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [document, error] = await getDocumentByIdAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [numberOfReferences, numberOfReferencesError] =
    await getDocumentRelationsCountAction(documentId);

  const deleteFormInfo =
    numberOfReferences !== null && numberOfReferences > 0 ? (
      <span>
        {`You cannot delete a document that is referenced in other
        database entries. This document is linked to 
        ${numberOfReferences} 
        ${numberOfReferences > 1 ? "entries" : "entry"}. If you want to delete this document, you must first unlink it from all its references.`}
      </span>
    ) : (
      <DeleteFormInfo type="document" />
    );
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
        <DeleteForm
          name={document.name}
          access={hasFullAccess}
          type="document"
          id={documentId}
          disabled={numberOfReferences > 0}
          onDelete={deleteDocumentAction}
          formInfo={deleteFormInfo}
        />
      )}
    </InfoPageWrapper>
  );
}

export default EditDocumentPage;

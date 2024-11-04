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
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function EditDocumentPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("document.edit");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [document, error] = await getDocumentByIdAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [numberOfReferences, numberOfReferencesError] =
    await getDocumentRelationsCountAction(documentId);
  if (numberOfReferencesError !== null)
    return <ErrorPage message={numberOfReferencesError} />;

  const hasReferences = numberOfReferences > 0;

  const DeleteFormInfoSelector = () =>
    hasReferences ? (
      <span>
        {t("delete-form-info", {
          count: numberOfReferences,
        })}
      </span>
    ) : undefined;
  return (
    <InfoPageWrapper
      title={t("title")}
      subtitle={t("subtitle", { documentName: document.name })}
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
          disabled={hasReferences}
          onDelete={deleteDocumentAction}
          FormInfo={<DeleteFormInfoSelector />}
        />
      )}
    </InfoPageWrapper>
  );
}

export default EditDocumentPage;

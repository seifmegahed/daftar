import { getClientFullByIdAction } from "@/server/actions/clients/read";
import {
  updateClientNotesAction,
  updateClientWebsiteAction,
  updateClientRegistrationNumberAction,
} from "@/server/actions/clients/update";
import { getCurrentUserAction } from "@/server/actions/users";
import { getClientProjectsCountAction } from "@/server/actions/projects/read";

import InfoPageWrapper from "@/components/info-page-wrapper";
import NotesForm from "@/components/common-forms/update-notes-form";
import RegistrationNumberForm from "@/components/common-forms/update-registration-form";
import WebsiteForm from "@/components/common-forms/update-website-form";
import DeleteForm from "@/components/common-forms/delete-form";
import { deleteClientAction } from "@/server/actions/clients/delete";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function EditClientPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("client.edit");

  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message={t("invalid-id")} />;

  const [client, error] = await getClientFullByIdAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [clientProjects, clientProjectsError] =
    await getClientProjectsCountAction(clientId);
  if (clientProjectsError !== null)
    return <ErrorPage message={clientProjectsError} />;

  const hasProjects = clientProjects > 0;

  const DeleteFormInfoSelector = () =>
    hasProjects ? (
      <>
        {t("delete-form-info", {
          count: clientProjects,
        })}
      </>
    ) : undefined;

  return (
    <InfoPageWrapper
      title={t("title")}
      subtitle={t("subtitle", { clientName: client.name })}
    >
      <RegistrationNumberForm
        id={clientId}
        updateRegistrationNumberCallbackAction={
          updateClientRegistrationNumberAction
        }
        type="client"
        registrationNumber={client.registrationNumber ?? ""}
      />
      <WebsiteForm
        id={clientId}
        updateWebsiteCallbackAction={updateClientWebsiteAction}
        website={client.website ?? ""}
        type="client"
      />
      <NotesForm
        id={clientId}
        updateCallbackAction={updateClientNotesAction}
        notes={client.notes ?? ""}
        type="client"
      />
      {clientProjects !== null && (
        <DeleteForm
          name={client.name}
          access={hasFullAccess}
          type="client"
          id={clientId}
          onDelete={deleteClientAction}
          disabled={hasProjects}
          FormInfo={<DeleteFormInfoSelector />}
        />
      )}
    </InfoPageWrapper>
  );
}
export default EditClientPage;

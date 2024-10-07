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
import DeleteFormInfo from "@/components/common-forms/delete-form/DeleteFormInfo";

async function EditClientPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  if (isNaN(clientId)) return <p>Error: Client ID is not a number</p>;

  const [client, error] = await getClientFullByIdAction(clientId);
  if (error !== null) return <p>An error occurred, please try again.</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [clientProjects] = await getClientProjectsCountAction(clientId);

  const deleteFormInfo =
    clientProjects !== null && clientProjects > 0 ? (
      <>
        {`You cannot delete a client that is linked to ${clientProjects > 1 ? `${clientProjects} projects` : "a project"}.`}
      </>
    ) : (
      <DeleteFormInfo type="client" />
    );
  return (
    <InfoPageWrapper
      title="Edit Client"
      subtitle={`This is the edit page for the client: ${client.name}. Here you can edit the client details.`}
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
          disabled={clientProjects > 0}
          formInfo={deleteFormInfo}
        />
      )}
    </InfoPageWrapper>
  );
}
export default EditClientPage;

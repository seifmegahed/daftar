import InfoPageWrapper from "@/components/info-page-wrapper";
import {
  getClientFullByIdAction,
  updateClientRegistrationNumberAction,
} from "@/server/actions/clients";
import NotesForm from "@/components/common-forms/update-notes-form";
import { updateClientNotesAction } from "@/server/actions/clients";
import RegistrationNumberForm from "@/components/common-forms/update-registration-form";
import WebsiteForm from "@/components/common-forms/update-website-form";
import { updateClientWebsiteAction } from "@/server/actions/clients";
import { getCurrentUserAction } from "@/server/actions/users";
import DeleteClientForm from "./delete-client-form";
import { getClientProjectsCountAction } from "@/server/actions/projects";

async function EditClientPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  if (isNaN(clientId)) return <p>Error: Client ID is not a number</p>;

  const [client, error] = await getClientFullByIdAction(clientId);
  if (error !== null) return <p>An error occurred, please try again.</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [clientProjects] = await getClientProjectsCountAction(clientId);
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
        <DeleteClientForm
          clientId={clientId}
          name={client.name}
          access={hasFullAccess}
          numberOfProjects={clientProjects}
        />
      )}
    </InfoPageWrapper>
  );
}
export default EditClientPage;
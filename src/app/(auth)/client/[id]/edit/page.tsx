import InfoPageWrapper from "@/components/info-page-wrapper";
import { getClientFullByIdAction } from "@/server/actions/clients";
import NotesForm from "./notes-form";
import RegistrationNumberForm from "./registration-number-form";
import WebsiteForm from "./website-form";
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
        clientId={clientId}
        registrationNumber={client.registrationNumber ?? ""}
      />
      <WebsiteForm clientId={clientId} website={client.website ?? ""} />
      <NotesForm clientId={clientId} notes={client.notes ?? ""} />
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

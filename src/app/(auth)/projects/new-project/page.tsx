import { listAllClientsAction } from "@/server/actions/clients";
import { listAllUsersAction } from "@/server/actions/users";
import NewProjectForm from "./form";

async function NewProjectPage() {
  const [userList, userError] = await listAllUsersAction();
  if (userError !== null) return <div>Error getting users</div>;

  const [clientList, clientError] = await listAllClientsAction();
  if (clientError !== null) return <div>Error getting clients</div>;

  return <NewProjectForm userList={userList} clientList={clientList} />;
}

export default NewProjectPage;

import { listAllClientsAction } from "@/server/actions/clients/read";
import { listAllUsersAction } from "@/server/actions/users";
import NewProjectForm from "./form";
import ErrorPage from "@/components/error";

async function NewProjectPage() {
  const [userList, userError] = await listAllUsersAction();
  if (userError !== null) return <ErrorPage message={userError} />;

  const [clientList, clientError] = await listAllClientsAction();
  if (clientError !== null) return <ErrorPage message={clientError} />;

  return <NewProjectForm userList={userList} clientList={clientList} />;
}

export default NewProjectPage;

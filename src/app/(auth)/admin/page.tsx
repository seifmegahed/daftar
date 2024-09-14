import { getAllUsersAction } from "@/server/actions/users";
import UsersTable from "./users-table";
import NewUserForm from "./new-user-form";

async function AdminPage() {
  const users = await getAllUsersAction();
  return (
    <div className="flex w-full flex-col items-center gap-5 pb-5">
      <UsersTable users={users} />
      <NewUserForm />
    </div>
  );
}

export default AdminPage;

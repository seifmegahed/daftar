import { Button } from "@/components/ui/button";
import { getAllUsersAction } from "@/server/actions/users";
import UsersTable from "./users-table";

async function AdminPage() {
  const users = await getAllUsersAction();
  return (
    <div className="flex w-full justify-center">
      <UsersTable users={users} />
    </div>
  );
}

export default AdminPage;

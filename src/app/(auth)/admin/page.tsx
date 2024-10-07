import { getAllUsersAction } from "@/server/actions/users";
import type { GetPartialUserType } from "@/server/db/tables/user/queries";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

async function AdminPage() {
  const [users, error] = await getAllUsersAction();
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function UserCard({ user }: { user: GetPartialUserType }) {
  return (
    <div className="flex gap-4 rounded-md border p-5">
      <div className="flex w-full flex-col gap-2">
        <div>
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.username}</div>
        </div>
        {user.role === "admin" ? (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <div>Role</div>
            <div>Admin</div>
          </div>
        ) : (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <div>Role</div>
            <div>User</div>
          </div>
        )}
        <div className="flex gap-2 text-sm text-muted-foreground">
          <div>Active</div>
          <div>{user.active ? "Yes" : "No"}</div>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <div>Last Active</div>
          <div>{user.lastActive ? format(user.lastActive, "PPP") : "-"}</div>
        </div>
      </div>
      <div>
        <Link href={`/admin/edit-user/${user.id}`}>
          <div className="cursor-pointer rounded-full p-3 text-muted-foreground hover:bg-muted">
            <Edit className="h-6 w-6" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminPage;

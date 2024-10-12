import Pagination from "@/components/pagination";
import { defaultPageLimit } from "@/data/config";
import { getAllUsersAction, getUsersCountAction } from "@/server/actions/users";
import type { GetPartialUserType } from "@/server/db/tables/user/queries";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function AdminPage({ searchParams }: { searchParams: { page: string } }) {
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);

  const [users, error] = await getAllUsersAction(page, defaultPageLimit);
  const [count, countError] = await getUsersCountAction();

  if (error !== null || countError !== null)
    return <p>Error: Could not load users</p>;
  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      <Pagination totalPages={Math.ceil(count / defaultPageLimit)} />
    </div>
  );
}

function UserCard({ user }: { user: GetPartialUserType }) {
  return (
    <div className="flex gap-6 rounded-md border p-5">
      <div className="flex w-full justify-between">
        <div>
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.username}</div>
        </div>
        <div className="flex min-w-48 flex-col gap-1">
          {user.role === "admin" ? (
            <div className="flex justify-between gap-2 text-sm text-muted-foreground">
              <div>Role:</div>
              <div>Admin</div>
            </div>
          ) : (
            <div className="flex justify-between gap-6 text-sm text-muted-foreground">
              <div>Role:</div>
              <div>User</div>
            </div>
          )}
          <div className="flex justify-between gap-6 text-sm text-muted-foreground">
            <div>Active:</div>
            <div>{user.active ? "Yes" : "No"}</div>
          </div>
          <div className="flex justify-between gap-6 text-sm text-muted-foreground">
            <div>Last Login:</div>
            <div>{user.lastActive ? format(user.lastActive, "PP") : "-"}</div>
          </div>
        </div>
      </div>
      <div>
        <Link href={`/admin/edit-user/${user.id}`}>
          <div className="-me-4 -mt-4 cursor-pointer rounded-full p-3 text-muted-foreground hover:bg-muted">
            <Edit className="h-6 w-6" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminPage;

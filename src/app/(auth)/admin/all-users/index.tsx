import CardWrapper from "@/components/card-wrapper";
import type { GetPartialUserType } from "@/server/db/tables/user/queries";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

function AllUsersList({ users }: { users: GetPartialUserType[] }) {
  return (
    <div className="flex flex-col sm:gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function UserCard({ user }: { user: GetPartialUserType }) {
  return (
    <CardWrapper>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
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
    </CardWrapper>
  );
}

export default AllUsersList;

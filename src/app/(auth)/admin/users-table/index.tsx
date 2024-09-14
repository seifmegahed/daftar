import { Button } from "@/components/ui/button";

import type { UserDataType } from "@/server/db/tables/user/schema";
import Link from "next/link";
import type { Overwrite } from "utility-types";

type UsersTableProps = {
  users: Overwrite<
    Pick<UserDataType, "id" | "username" | "name" | "role">,
    { name: string | null }
  >[];
};

function UsersTable({ users }: UsersTableProps) {
  return (
    <table className="w-full max-w-screen-md">
      <thead className="text-left">
        <tr className="border-b border-gray-200 py-2 text-left font-bold">
          <td className="w-1/12">ID</td>
          <td className="w-1/4">Username</td>
          <td className="w-1/4">Name</td>
          <td className="w-fit">Role</td>
          <td className="w-fit">Actions</td>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.name ?? "N/A"}</td>
            <td>{user.role.toUpperCase()}</td>
            <td className="flex gap-3 py-2">
              <Link href={`/admin/edit-user/${user.id}`}>
                <Button variant="ghost">Edit</Button>
              </Link>
              <Button variant="ghost">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;

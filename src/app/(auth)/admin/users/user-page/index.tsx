import { type GetPartialUserType } from "@/server/db/tables/user/queries";
import AdminEditUserForm from "./user-edit-form";
import { Button } from "@/components/ui/button";
import PageTitle from "./title";
import { format } from "date-fns";
import DataDisplayTable from "@/components/data-display-table";

function UserPage({ user }: { user: GetPartialUserType }) {
  return (
    <>
      <PageTitle title={user.name} />
      <hr></hr>
      <UserInfo user={user} />
      <hr></hr>
      <AdminEditUserForm user={user} />
      <hr></hr>
      <ActiveProjectsSection />
    </>
  );
}

function ActiveProjectsSection() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <h1 className="text-2xl font-bold">Active Projects</h1>
      <p className="text-xs text-muted-foreground">
        List of active projects where this user is an owner.
      </p>
      {[
        {
          id: 1,
          name: "Project 1",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          client: "Client 1",
        },
        {
          id: 2,
          name: "Project 2",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          client: "Client 2",
        },
      ].map((project) => (
        <div className="flex flex-col gap-2 py-4" key={project.id}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.client}</p>
          </div>
          <p className="text-xs text-muted-foreground">{project.description}</p>
          <div className="flex justify-end">
            <Button variant="outline" className="w-40">
              Go to Project
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserInfo({ user }: { user: GetPartialUserType }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-5 text-muted-foreground">
      <div>
        <DataDisplayTable
          data={[
            { name: "ID:", value: user.id.toString() },
            { name: "username:", value: user.username },
            { name: "Tole:", value: user.role.toUpperCase() },
            { name: "State:", value: user.active ? "Active" : "Deactivated" },
          ]}
        />
      </div>
      <div className="flex justify-end border-l">
        <DataDisplayTable
          data={[
            { name: "Date Created:", value: format(user.createdAt, "PP") },
            {
              name: "Date Updated:",
              value: user.updatedAt ? format(user.updatedAt, "PP") : "N/A",
            },
            {
              name: "Last Active:",
              value: user.lastActive ? format(user.lastActive, "PP") : "N/A",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default UserPage;

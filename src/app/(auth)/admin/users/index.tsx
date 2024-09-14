import * as Tabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";

import { getAllUsersAction } from "@/server/actions/users";
import NewUserForm from "./new-user-form";
import UserPage from "./user-page";
import { Card } from "@/components/ui/card";
import { AddNewUserTab, UserTab } from "./user-tabs";
import { toast } from "sonner";

async function Users() {
  const [users, error] = await getAllUsersAction();

  if (error !== null) {
    console.error("Error getting users:", error);
    toast.error(error);
    return <div>Error getting users</div>;
  }

  return (
    <Tabs.Root defaultValue="add-user" className="">
      <Card className="h-[75vh] max-w-6xl overflow-hidden">
        <div className="grid h-full grid-cols-6">
          <div className="col-span-2 h-full overflow-y-scroll">
            <SectionTitle title="Users" />
            <div className="flex flex-col">
              <Tabs.List>
                <AddNewUserTab />
                {users.map((user) => (
                  <UserTab key={user.id} name={user.name} value={user.username} />
                ))}
              </Tabs.List>
            </div>
          </div>
          <div className="col-span-4 h-full overflow-y-scroll border-l">
            <Tabs.Content value="add-user">
              <NewUserForm />
            </Tabs.Content>
            {users.map((user) => (
              <Tabs.Content key={user.id} value={user.username}>
                <UserPage user={user} />
              </Tabs.Content>
            ))}
          </div>
        </div>
      </Card>
    </Tabs.Root>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}

export default Users;

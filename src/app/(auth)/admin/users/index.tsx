import * as Tabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";

import { getAllUsersAction } from "@/server/actions/users";
import NewUserForm from "./new-user-form";
import UserPage from "./user-page";
import { Card } from "@/components/ui/card";


async function Users() {
  const users = await getAllUsersAction();
  return (
    <Tabs.Root defaultValue="add-user">
      <Card className="h-[75vh] overflow-hidden">
        <div className="grid h-full grid-cols-6">
          <div className="col-span-2 h-full overflow-y-scroll">
            <SectionTitle title="Users" />
            <div className="flex flex-col">
              <Tabs.List>
                <AddNewUserTab />
                {users.map((user) => (
                  <UserCard key={user.id} username={user.username} />
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

function AddNewUserTab() {
  return (
    <Tabs.Trigger value="add-user" className="w-full">
      <UserCardItem>
        <UserAvatarContainer>
          <Plus size={20} />
        </UserAvatarContainer>
        <UserCardItemText>New User</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

function UserCard({ username }: { username: string }) {
  return (
    <Tabs.Trigger value={username} className="w-full">
      <UserCardItem>
        <UserAvatarContainer>
          {username[0]?.toUpperCase() ?? "?"}
        </UserAvatarContainer>
        <UserCardItemText>{username}</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

function UserAvatarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-md flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <div>{children}</div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}

function UserCardItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex cursor-pointer items-center gap-2 border-t p-3 transition-colors duration-300 ease-in-out hover:bg-muted">
      {children}
    </div>
  );
}

function UserCardItemText({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
}

export default Users;

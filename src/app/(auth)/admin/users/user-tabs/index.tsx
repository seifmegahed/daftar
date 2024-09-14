import { getInitials } from "@/utils/user";
import * as Tabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";

export function AddNewUserTab() {
  return (
    <Tabs.Trigger
      value="add-user"
      className="group w-full data-[state=active]:bg-muted"
    >
      <UserCardItem>
        <UserAvatarContainer>
          <Plus size={20} />
        </UserAvatarContainer>
        <UserCardItemText>New User</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

export function UserTab({ name, value }: { name: string; value: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className="group w-full data-[state=active]:bg-muted"
    >
      <UserCardItem>
        <UserAvatarContainer>
          {getInitials(name)}
        </UserAvatarContainer>
        <UserCardItemText>{name}</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

function UserAvatarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-md flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-1000 ease-in-out group-hover:bg-white group-data-[state=active]:bg-white">
      <div>{children}</div>
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

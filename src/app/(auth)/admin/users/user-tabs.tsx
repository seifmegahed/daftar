import {
  AdminUserAvatarContainer,
  AvatarContainer,
  DeactivatedUserAvatarContainer,
} from "@/components/avatar";
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
        <AvatarContainer>
          <Plus size={20} />
        </AvatarContainer>
        <UserCardItemText>New User</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

export function UserTab({
  name,
  value,
  state,
  role,
}: {
  name: string;
  value: string;
  state: boolean;
  role: string;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="group w-full data-[state=active]:bg-muted"
    >
      <UserCardItem>
        <UserAvatarContainer state={state} role={role}>
          {getInitials(name)}
        </UserAvatarContainer>
        <UserCardItemText>{name}</UserCardItemText>
      </UserCardItem>
    </Tabs.Trigger>
  );
}

function UserAvatarContainer({
  children,
  state,
  role,
}: {
  children: React.ReactNode;
  state: boolean;
  role: string;
}) {
  if (!state)
    return (
      <DeactivatedUserAvatarContainer>
        {children}
      </DeactivatedUserAvatarContainer>
    );
  if (role === "admin")
    return <AdminUserAvatarContainer>{children}</AdminUserAvatarContainer>;
  return <AvatarContainer>{children}</AvatarContainer>;
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

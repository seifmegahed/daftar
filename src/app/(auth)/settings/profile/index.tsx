import { AvatarContainer } from "@/components/avatar";
import DataDisplayTable from "@/components/data-display-table";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getCurrentUserAction } from "@/server/actions/users";
import { getInitials } from "@/utils/user";
import { format } from "date-fns";
import { toast } from "sonner";

async function SettingsProfilePage() {
  const [user, error] = await getCurrentUserAction();
  if (error !== null) {
    toast.error(error);
    return <div>Error getting user</div>;
  }
  return (
    <InfoPageWrapper title="Profile" subtitle="">
      <div className="flex items-center gap-2">
        <AvatarContainer className="size-16 text-2xl">
          {getInitials(user.name)}
        </AvatarContainer>
        <h1 className="text-3xl text-muted-foreground">{user.name}</h1>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <DataDisplayTable
          data={[
            { name: "Name:", value: user.name },
            { name: "username:", value: user.username },
            { name: "Role:", value: user.role.toUpperCase() },
            { name: "Created At:", value: format(user.createdAt, "PP") },
            {
              name: "Updated At:",
              value: user.updatedAt ? format(user.updatedAt, "PP") : "N/A",
            },
            {
              name: "Last Login:",
              value: user.lastActive ? format(user.lastActive, "PP") : "N/A",
            },
          ]}
        />
      </div>
      <p className="max-w-xl text-xs text-muted-foreground">
        Your username cannot be changed, however you can change your display
        name. By changing your display name, your avatar will be updated to
        reflect your new name. You can also change your password.
        <br></br>
        <br></br>
        To change your name or password, navigate to the {'"Account"'} tab on
        the left sidebar.
        <br></br>
        <br></br>
        Your user role can only be changed by an administrator. If you think
        your role is incorrect, please contact an administrator.
      </p>
    </InfoPageWrapper>
  );
}

export default SettingsProfilePage;

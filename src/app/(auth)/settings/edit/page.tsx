import { Separator } from "@/components/ui/separator";
import ChangeNameForm from "./change-name-form";
import ChangePasswordForm from "./change-password-form";
import { getCurrentUserAction } from "@/server/actions/users";

async function SettingsAccountPage() {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return <p>Error: {currentUserError}</p>
  ;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">Update your account.</p>
      </div>
      <Separator />
      <p className="font-medium text-lg">Update name</p>
      <ChangeNameForm name={currentUser.name} />
      <Separator />
      <p className="font-medium text-lg">Update password</p>
      <ChangePasswordForm />
    </div>
  );
}

export default SettingsAccountPage;

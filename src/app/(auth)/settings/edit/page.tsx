import ChangeNameForm from "./change-name-form";
import ChangePasswordForm from "./change-password-form";
import { getCurrentUserAction } from "@/server/actions/users";
import InfoPageWrapper from "@/components/info-page-wrapper";

async function SettingsAccountPage() {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return <p>Error: {currentUserError}</p>;
  return (
    <InfoPageWrapper title="Edit" subtitle="Edit your account details">
      <ChangeNameForm name={currentUser.name} />
      <ChangePasswordForm />
    </InfoPageWrapper>
  );
}

export default SettingsAccountPage;

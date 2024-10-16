import ChangeNameForm from "./change-name-form";
import ChangePasswordForm from "./change-password-form";
import { getCurrentUserAction } from "@/server/actions/users";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ErrorPage from "@/components/error";

async function SettingsAccountPage() {
  const [currentUser, error] = await getCurrentUserAction();
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <InfoPageWrapper title="Edit" subtitle="Edit your account details">
      <ChangeNameForm name={currentUser.name} />
      <ChangePasswordForm />
    </InfoPageWrapper>
  );
}

export default SettingsAccountPage;

import ChangeNameForm from "./change-name-form";
import ChangePasswordForm from "./change-password-form";
import { getCurrentUserAction } from "@/server/actions/users";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ErrorPage from "@/components/error";
import ChangeEmailSection from "@/app/[locale]/(auth)/admin/edit-user/[id]/change-email-section";
import ChangePhoneNumberSection from "@/app/[locale]/(auth)/admin/edit-user/[id]/change-phone-number-section";

async function SettingsAccountPage() {
  const [currentUser, error] = await getCurrentUserAction();
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <InfoPageWrapper title="Edit" subtitle="Edit your account details">
      <ChangeNameForm name={currentUser.name} />
      <ChangeEmailSection
        userId={currentUser.id}
        email={currentUser.email ?? ""}
        type="user"
      />
      <ChangePhoneNumberSection
        userId={currentUser.id}
        phoneNumber={currentUser.phoneNumber ?? ""}
        type="user"
      />
      <ChangePasswordForm />
    </InfoPageWrapper>
  );
}

export default SettingsAccountPage;

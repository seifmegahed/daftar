import ChangeNameSection from "./change-name-section";
import ChangePasswordSection from "./change-password-section";
import ChangeRoleSection from "./change-role-section";
import ActivateDeactivateUserSection from "./activate-deactivate-user-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import {
  getCurrentUserAction,
  getUserByIdAction,
} from "@/server/actions/users";
import ErrorPage from "@/components/error";

async function EditUserPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message="Invalid user ID" />;

  const [userData, error] = await getUserByIdAction(id);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null)
    return (
      <ErrorPage
        title="Oops, this page is not accessible"
        message={currentUserError}
      />
    );
  if (currentUser.role !== "admin")
    return (
      <ErrorPage
        title="Oops, this page is not accessible"
        message="You are trying to access a private page. You need to be an admin to access this page."
      />
    );

  return (
    <InfoPageWrapper
      title="Edit User"
      subtitle={`This is the edit page for the user: ${userData.name}. Here you can edit the user details.`}
    >
      <ChangeNameSection userId={userData.id} name={userData.name} />
      <ChangeRoleSection userId={userData.id} userRole={userData.role} />
      <ChangePasswordSection userId={userData.id} />
      <ActivateDeactivateUserSection
        userId={userData.id}
        userActive={userData.active}
      />
    </InfoPageWrapper>
  );
}

export default EditUserPage;

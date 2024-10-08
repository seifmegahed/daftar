import ChangeNameSection from "./change-name-section";
import ChangePasswordSection from "./change-password-section";
import ChangeRoleSection from "./change-role-section";
import ActivateDeactivateUserSection from "./activate-deactivate-user-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import {
  getCurrentUserAction,
  getUserByIdAction,
} from "@/server/actions/users";

async function EditUserPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) return <p>Invalid ID</p>;

  const [userData, error] = await getUserByIdAction(id);
  if (error !== null) return <p>Error not found</p>;

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return <p>Error not authorized</p>;
  if (currentUser.role !== "admin") return <p>Error not authorized</p>;

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

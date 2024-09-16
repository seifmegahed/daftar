import { GetPartialUserType } from "@/server/db/tables/user/queries";
import ChangeNameSection from "./change-name-section";
import ChangePasswordSection from "./change-password-section";
import ChangeRoleSection from "./change-role-section";
import ActivateDeactivateUserSection from "./activate-deactivate-user-section";

function AdminEditUserForm({ user }: { user: GetPartialUserType }) {
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <ChangeNameSection userId={user.id} name={user.name} />
      <hr></hr>
      <ChangeRoleSection userId={user.id} userRole={user.role} />
      <hr></hr>
      <ChangePasswordSection userId={user.id} />
      <hr></hr>
      <ActivateDeactivateUserSection
        userId={user.id}
        userActive={user.active}
      />
    </div>
  );
}

export default AdminEditUserForm;

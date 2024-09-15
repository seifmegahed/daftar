import { GetPartialUserType } from "@/server/db/tables/user/queries";
import {
  ChangeNameSection,
  ChangePasswordSection,
  ChangeRoleSection,
  ActivateDeactivateUserSection,
} from "./sections";

function AdminEditUserForm({ user }: { user: GetPartialUserType }) {
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <ChangeNameSection name={user.name} />
      <hr></hr>
      <ChangeRoleSection userRole={user.role} />
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

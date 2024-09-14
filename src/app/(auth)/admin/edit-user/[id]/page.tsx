import { getUserByIdAction } from "@/server/actions/users";

async function EditUser({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) throw new Error("Invalid user ID");
  const user = await getUserByIdAction(id);
  if ("error" in user) throw new Error(user.error);
  return (
    <div>
      <h1>Edit User</h1>
      <p>User ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default EditUser;

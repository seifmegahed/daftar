import { getAllUsersAction } from "@/server/actions/users";

async function AdminPage() {
  const [users, error] = await getAllUsersAction();
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default AdminPage;

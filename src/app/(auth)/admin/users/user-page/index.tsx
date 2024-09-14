import { Button } from "@/components/ui/button";

type UserPageProps = {
  user: {
    id: number;
    username: string;
    name: string | null;
    role: string;
  };
};

function UserPage({ user }: UserPageProps) {
  return (
    <div>
      <div className="flex flex-col gap-2 p-5">
        <h1 className="text-2xl">{user.username}</h1>
        <p>User ID: {user.id}</p>
        <p>Username: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>Role: {user.role}</p>
        <p>Last Active: {new Date().toLocaleString()}</p>
        <div className="flex justify-between">
          <Button variant="outline" className="w-40">
            Deactivate
          </Button>
          <Button variant="outline" className="w-40" disabled>
            Save
          </Button>
        </div>
      </div>
      <hr></hr>
      <div className="flex flex-col gap-2 p-5">
        <h1 className="text-xl">Projects</h1>
      </div>
      <hr></hr>
      <div className="flex flex-col gap-2 p-5">
        <h1 className="text-xl">Change Password</h1>
        {/* <ChangePasswordForm user={user} /> */}
      </div>
    </div>
  );
}

export default UserPage;
"use client";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth/logout";
import { useRouter } from "next/navigation";

function AdminPage() {
  const router = useRouter();
  return (
    <div>
      Admin Page
      <Button
        onClick={async () =>
          await logoutAction().then(() => router.push("/login"))
        }
      >
        Logout
      </Button>
    </div>
  );
}

export default AdminPage;

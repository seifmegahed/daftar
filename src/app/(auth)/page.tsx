"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth/logout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="flex w-full justify-between p-5">
      <h1 className="text-3xl font-bold">Daftar</h1>
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

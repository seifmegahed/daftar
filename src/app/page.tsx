"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth/logout";

export default function HomePage() {
  return (
    <main>
      <div className="flex w-full justify-between p-5">
        <h1 className="text-3xl font-bold">Daftar</h1>
        <Button onClick={() => logoutAction()}>Logout</Button>
      </div>
    </main>
  );
}

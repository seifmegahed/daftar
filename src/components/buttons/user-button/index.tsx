"use client";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/server/actions/auth/logout";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/loading-overlay";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/exceptions";
import { useTheme } from "next-themes";
import { getInitials } from "@/utils/user";
import type { UserDataType } from "@/server/db/tables/user/schema";
import Link from "next/link";
import { AvatarContainer } from "@/components/avatar";

function UserButton({
  user,
}: {
  user: Pick<UserDataType, "id" | "username" | "name" | "role">;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  if (!user) return null;
  const initials = getInitials(user.name);

  const logout = async () => {
    setLoading(true);
    await logoutAction()
      .then((res) => {
        const [, error] = res;
        if (error) throw new Error(error);
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        toast.error(getErrorMessage(error));
        setLoading(false);
      });
  };
  return (
    <>
      <LoadingOverlay state={loading} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <AvatarContainer>
              {initials}
            </AvatarContainer>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="dark:hidden"
            onClick={() => {
              setTheme("dark");
            }}
          >
            Dark Mode
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hidden dark:block"
            onClick={() => {
              setTheme("light");
            }}
          >
            Light Mode
          </DropdownMenuItem>
          <Link href="settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserButton;

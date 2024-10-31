"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

import { logoutAction } from "@/server/actions/auth/logout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AvatarContainer } from "@/components/avatar";
import Loading from "@/components/loading";

import { getInitials } from "@/utils/user";

function UserButton({ user }: { user: { name: string; id: number } }) {
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  const initials = getInitials(user.name);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await logoutAction();
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while logging out");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          disabled={loading}
        >
          <AvatarContainer>
            {loading ? <Loading className="h-7 w-7" /> : initials}
          </AvatarContainer>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
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
        <Link href="/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;

"use client";

import { useLayoutEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { LogOut, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";

function UserButton({ user }: { user: { name: string; id: number } }) {
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();
  const [direction, setDirection] = useState<Direction>("ltr");

  useLayoutEffect(() => {
    if (!document) return;
    setDirection(document.dir as Direction);
  }, []);

  const initials = getInitials(user.name);

  const t = useTranslations("user-button");

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
    <DropdownMenu dir={direction}>
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
          <div className="flex w-full cursor-pointer items-center justify-between">
            {t("dark-mode")} <MoonIcon className="h-4 w-4" />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hidden dark:block"
          onClick={() => {
            setTheme("light");
          }}
        >
          <div className="flex w-full cursor-pointer items-center justify-between">
            {t("light-mode")}
            <SunIcon className="h-4 w-4" />
          </div>
        </DropdownMenuItem>
        <Link href="/settings">
          <DropdownMenuItem>
            <div className="flex w-full cursor-pointer items-center justify-between">
              {t("settings")}
              <SettingsIcon className="h-4 w-4" />
            </div>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <div className="flex w-full cursor-pointer items-center justify-between">
            {t("logout")}
            <LogOut className="h-4 w-4" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;

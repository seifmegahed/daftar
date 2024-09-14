"use client";

import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

function UserButton() {
  const user = { given_name: "Seif", family_name: "Megahed" };
  const router = useRouter();
  let initials = null;
  if (!user) return null;
  const { given_name, family_name } = user;
  if (given_name && family_name) initials = given_name[0] + family_name[0]!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {initials === null ? (
            <CircleUser className="h-5 w-5" />
          ) : (
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div
            onClick={async () => {
              await logoutAction().then((res) => {
                const [, error] = res;
                if (error) throw new Error(error);
                router.push("/login");
              });
            }}
          >
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;

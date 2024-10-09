"use server";

import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
// import { SearchBar } from "@/components/inputs";
import { UserButton } from "@/components/buttons";
import { getCurrentUserAction } from "@/server/actions/users";
import { redirect } from "next/navigation";

async function TopNav() {
  const [currentUser, error] = await getCurrentUserAction();

  if (error !== null) {
    redirect("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <DesktopNav admin={currentUser.role === "admin"} />
      <MobileNav admin={currentUser.role === "admin"} />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* <SearchBar /> */}
        <UserButton user={currentUser} />
      </div>
    </header>
  );
}

export default TopNav;

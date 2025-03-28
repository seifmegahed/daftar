import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import { UserButton, LanguageButton } from "@/components/buttons";
import { getCurrentUserAction } from "@/server/actions/users";

async function TopNav() {
  const [currentUser, error] = await getCurrentUserAction();
  if (error !== null) throw new Error("User not found");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-3 md:px-6">
      <DesktopNav admin={currentUser.role === "admin"} />
      <MobileNav admin={currentUser.role === "admin"} />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="w-full flex items-center gap-4 justify-end">
          <LanguageButton />
          <UserButton user={currentUser} />
        </div>
      </div>
    </header>
  );
}

export default TopNav;

import ErrorPage from "@/components/error";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import { UserButton } from "@/components/buttons";
import { getCurrentUserAction } from "@/server/actions/users";

async function TopNav() {
  const [currentUser, error] = await getCurrentUserAction();
  if (error !== null) return <ErrorPage message="Please try again later." />;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-3 md:px-6">
      <DesktopNav admin={currentUser.role === "admin"} />
      <MobileNav admin={currentUser.role === "admin"} />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="w-full"></div>
        <UserButton user={currentUser} />
      </div>
    </header>
  );
}

export default TopNav;

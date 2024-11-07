import { Link } from "@/i18n/routing";
import { BookmarkIcon } from "@/icons";

import NavLinks from "../nav-links";

function DesktopNav({ admin }: { admin: boolean }) {
  return (
    <nav className="hidden flex-col gap-4 text-lg font-medium md:flex md:flex-row md:items-center md:text-sm">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <BookmarkIcon />
      </Link>
      <div className="flex items-center gap-8">
        <NavLinks admin={admin} />
      </div>
    </nav>
  );
}

export default DesktopNav;

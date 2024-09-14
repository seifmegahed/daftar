import Link from "next/link";
import { BookmarkIcon } from "@/icons";

import NavLinks from "../nav-links";

function DesktopNav({ admin }: { admin: boolean }) {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <BookmarkIcon />
        <span className="Dialog-title sr-only">Accounting UI</span>
      </Link>
      <NavLinks admin={admin} />
    </nav>
  );
}

export default DesktopNav;

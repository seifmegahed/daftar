import Link from "next/link";
import { BookmarkIcon } from "@/icons";

import NavLinks from "../nav-links";

function DesktopNav() {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <BookmarkIcon />
        <span className="sr-only Dialog-title">Accounting UI</span>
      </Link>
      <NavLinks />
    </nav>
  );
}

export default DesktopNav;

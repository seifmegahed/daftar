import Link from "next/link";
import { BookmarkIcon } from "@/icons";

import NavLinks from "../nav-links";

function DesktopNav({ admin }: { admin: boolean }) {
  return (
    <nav className="hidden flex-col gap-5 text-lg font-medium md:flex md:flex-row md:items-center md:text-sm">
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

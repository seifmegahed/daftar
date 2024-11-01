import { Link } from "@/i18n/routing";
import { Menu } from "lucide-react";
import { BookmarkIcon } from "@/icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "../nav-links";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { getLocale } from "next-intl/server";
import { getDirection } from "@/utils/common";

async function MobileNav({ admin }: { admin: boolean }) {
  const locale = await getLocale();
  const direction = getDirection(locale);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer md:hidden">
          <Menu className="h-5 w-5" />
          <DialogTitle className="hidden">Open menu</DialogTitle>
          <Description className="sr-only">Open menu</Description>
        </div>
      </SheetTrigger>
      <SheetContent side={direction === "rtl" ? "right" : "left"}>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <BookmarkIcon />
          </Link>
          <NavLinks admin={admin} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;

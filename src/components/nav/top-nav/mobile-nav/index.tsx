"use client";

import { Link } from "@/i18n/routing";
import { Menu } from "lucide-react";
import { BookmarkIcon } from "@/icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "../nav-links";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { getDirection } from "@/utils/common";
import { useLocale } from "next-intl";
import { useState } from "react";

function MobileNav({ admin }: { admin: boolean }) {
  const locale = useLocale();
  const direction = getDirection(locale);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="cursor-pointer md:hidden">
          <Menu className="h-6 w-6" />
          <DialogTitle className="hidden">Open menu</DialogTitle>
          <Description className="sr-only">Open menu</Description>
        </div>
      </SheetTrigger>
      <SheetContent side={direction === "rtl" ? "right" : "left"}>
        <nav className="grid gap-3 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center px-3 text-lg font-semibold"
            onClick={handleClose}
          >
            <BookmarkIcon />
          </Link>
          <NavLinks admin={admin} onClick={handleClose} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type NavLink = {
  title: string;
  href: string;
  amount?: number;
  hidden?: boolean;
};

function SidebarNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="max-w-screen flex h-16 space-x-2 overflow-x-scroll md:px-4 lg:h-full lg:flex-col lg:space-x-0 lg:space-y-1">
      {links.map((link) => link.hidden ? null : (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === link.href
              ? "bg-muted hover:bg-muted"
              : "group hover:bg-transparent",
          )}
        >
          {link.amount !== undefined ? (
            <div className="flex w-full items-center justify-between">
              <p className="group-hover:underline">{link.title}</p>
              <p className="hidden text-xs font-thin lg:block">{link.amount}</p>
            </div>
          ) : (
            <p className="w-full group-hover:underline">{link.title}</p>
          )}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarNav;

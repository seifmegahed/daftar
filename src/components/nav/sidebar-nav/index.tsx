"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    amount?: number;
  }[];
}

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "max-w-screen flex h-16 space-x-2 overflow-x-scroll px-4 lg:h-full lg:flex-col lg:space-x-0 lg:space-y-1 lg:px-0",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "group hover:bg-transparent",
          )}
        >
          {item.amount !== undefined ? (
            <div className="flex w-full items-center justify-between">
              <p className="group-hover:underline">{item.title}</p>
              <p className="hidden text-xs font-thin lg:block">{item.amount}</p>
            </div>
          ) : (
            <p className="w-full">{item.title}</p>
          )}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarNav;

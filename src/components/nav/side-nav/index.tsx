"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function Sidebar({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);
  useEffect(() => {
    setActiveLinkIndex(() => links.findIndex((link) => pathname.startsWith(link.href)));
  }, [pathname, links]);
  const activeLinkStyle = "font-semibold text-primary";
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {links.map((link, index) => (
        <Link
          key={link.label}
          href={link.href}
          className={index === activeLinkIndex ? activeLinkStyle : ""}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default Sidebar;

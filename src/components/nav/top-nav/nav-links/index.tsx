"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const data = [
  { name: "Dashboard", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Clients", href: "/clients" },
  { name: "Suppliers", href: "/suppliers" },
  { name: "Contacts", href: "/contacts" },
  { name: "Documents", href: "/documents" },
  { name: "Items", href: "/items" },
  { name: "Admin", href: "/admin" },
];

function NavLinks() {
  const pathname = "/" + usePathname().split("/")[1];
  const [activeLinkIndex, setActiveLinkIndex] = useState(-1);
  useEffect(() => {
    setActiveLinkIndex(() => data.findIndex((link) => link.href === pathname));
  }, [pathname]);
  return (
    <>
      {data.map((link, index) => (
        <Link
          key={link.name}
          href={link.href}
          className={`transition-colors hover:text-foreground ${activeLinkIndex === index ? "text-foreground" : "text-muted-foreground"}`}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}

export default NavLinks;

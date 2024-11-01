"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";

const routes = [
  { name: "Projects", href: "/projects", alt: "/project" },
  { name: "Clients", href: "/clients", alt: "/client" },
  { name: "Suppliers", href: "/suppliers", alt: "/supplier" },
  { name: "Items", href: "/items", alt: "/item" },
  { name: "Documents", href: "/documents", alt: "/document" },
];

const protectedRoutes = [{ name: "Admin", href: "/admin", alt: "/admin" }];

function NavLinks({ admin }: { admin: boolean }) {
  const data = useMemo(
    () => (admin ? [...routes, ...protectedRoutes] : routes),
    [admin],
  );
  const pathname = "/" + usePathname().split("/")[1];
  const [activeLinkIndex, setActiveLinkIndex] = useState(-1);
  useEffect(() => {
    setActiveLinkIndex(() =>
      data.findIndex((link) => link.href === pathname || link.alt === pathname),
    );
  }, [pathname, data]);
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

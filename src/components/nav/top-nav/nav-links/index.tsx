"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const routes = [
  { name: "Projects", href: "/projects", alt: "/project" },
  { name: "Clients", href: "/clients", alt: "/client" },
  { name: "Suppliers", href: "/suppliers", alt: "/supplier" },
  { name: "Items", href: "/items", alt: "/item" },
  { name: "Documents", href: "/documents", alt: "/document" },
] as const;

const protectedRoutes = [
  { name: "Admin", href: "/admin", alt: "/admin" },
] as const;

function NavLinks({ admin, onClick }: { admin?: boolean; onClick?: () => void }) {
  const pathname = "/" + usePathname().split("/")[1];
  const t = useTranslations("topnav");
  
  const data = admin ? [...routes, ...protectedRoutes] : routes;

  const selectedIndex = data.findIndex(
    (link) => link.href === pathname || link.alt === pathname,
  );
  return (
    <>
      {data.map((link, index) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onClick}
          className={`transition-colors hover:text-foreground ${selectedIndex === index ? "text-foreground" : "text-muted-foreground"}`}
        >
          {t(link.name)}
        </Link>
      ))}
    </>
  );
}

export default NavLinks;

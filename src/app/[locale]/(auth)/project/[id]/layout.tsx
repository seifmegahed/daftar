import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";

import { hasAccessToPrivateDataAction } from "@/server/actions/users";
import { getTranslations } from "next-intl/server";
import type { LocaleParams } from "@/i18n/set-locale";
const basePath = (id: string) => "/project/" + id;

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: { id: string, locale: LocaleParams["locale"] };
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  setLocale(params.locale);

  const t = await getTranslations("project.layout");
  const [userAccess] = await hasAccessToPrivateDataAction();

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: t("project"),
      href: basePath(id),
    },
    {
      title: t("edit"),
      href: basePath(id) + "/edit",
    },
    {
      title: t("sale-items"),
      href: basePath(id) + "/sale-items",
      hidden: !userAccess,
    },
    {
      title: t("purchase-items"),
      href: basePath(id) + "/purchase-items",
      hidden: !userAccess,
    },
    {
      title: t("documents"),
      href: basePath(id) + "/documents",
    },
    {
      title: t("commercial-offer"),
      href: basePath(id) + "/commercial-offer",
      hidden: !userAccess,
    },
    {
      title: t("new-purchase-item"),
      href: basePath(id) + "/new-purchase-item",
    },
    {
      title: t("new-sale-item"),
      href: basePath(id) + "/new-sale-item",
      hidden: !userAccess,
    },
    {
      title: t("new-document"),
      href: basePath(id) + "/new-document",
    },
    {
      title: t("comments"),
      href: basePath(id) + "/comments",
    },
  ];

  const sidebarNavItems = sidebarNavItemsGenerator(params.id);
  return (
    <PageLayout
      title={t("title")}
      description={t("description")}
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}

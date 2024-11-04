import PageLayout from "@/components/page-layout";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

const basePath = (id: string) => "/supplier/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string, locale: Locale };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.layout");

  const [access] = await hasAccessToPrivateDataAction();

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: t("supplier"),
      href: basePath(id),
    },
    {
      title: t("edit"),
      href: basePath(id) + "/edit",
    },
    {
      title: t("items"),
      href: basePath(id) + "/items",
      hidden: !access,
    },
    {
      title: t("projects"),
      href: basePath(id) + "/projects",
    },
    {
      title: t("documents"),
      href: basePath(id) + "/documents",
    },
    {
      title: t("addresses"),
      href: basePath(id) + "/addresses",
    },
    {
      title: t("contacts"),
      href: basePath(id) + "/contacts",
    },
    {
      title: t("new-address"),
      href: basePath(id) + "/new-address",
    },
    {
      title: t("new-contact"),
      href: basePath(id) + "/new-contact",
    },
    {
      title: t("new-document"),
      href: basePath(id) + "/new-document",
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

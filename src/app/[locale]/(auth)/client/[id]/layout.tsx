import PageLayout from "@/components/page-layout";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

const basePath = (id: string) => "/client/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string; locale: Locale };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("client.layout");

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: t("client"),
      href: basePath(id),
    },
    { title: t("edit"), href: basePath(id) + "/edit" },
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
      navLinks={sidebarNavItems}
      title={t("title")}
      description={t("description")}
    >
      {children}
    </PageLayout>
  );
}

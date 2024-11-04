import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

const basePath = (id: string) => "/item/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string; locale: Locale };
}


export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("item.layout");
  
  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: t("item"),
      href: basePath(id),
    },
    {
      title: t("edit"),
      href: basePath(id) + "/edit",
    },
    {
      title: t("projects"),
      href: basePath(id) + "/projects",
    },
    {
      title: t("suppliers"),
      href: basePath(id) + "/suppliers",
    },
    {
      title: t("documents"),
      href: basePath(id) + "/documents",
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

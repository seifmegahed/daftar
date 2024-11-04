import PageLayout from "@/components/page-layout";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

const basePath = (id: string) => "/document/" + id;

type SettingsLayoutProps = {
  children: React.ReactNode;
  params: { id: string; locale: Locale };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("document.layout");

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: t("document"),
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
      title: t("clients"),
      href: basePath(id) + "/clients",
    },
    {
      title: t("suppliers"),
      href: basePath(id) + "/suppliers",
    },
    {
      title: t("items"),
      href: basePath(id) + "/items",
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

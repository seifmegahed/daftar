import PageLayout from "@/components/page-layout";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import type { LocaleParams } from "@/i18n/set-locale";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: LocaleParams;
}

export default async function SettingsLayout({
  children,
  params: { locale },
}: SettingsLayoutProps) {
  setLocale(locale);
  const t = await getTranslations("projects.layout");

  const sidebarNavItems = [
    {
      title: t("All Projects"),
      href: "/projects",
    },
    {
      title: t("New Project"),
      href: "/projects/new-project",
    },
  ];
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

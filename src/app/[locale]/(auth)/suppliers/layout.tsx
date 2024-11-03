import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("suppliers.layout");
  
  const sidebarNavItems = [
    {
      title: t("all-suppliers"),
      href: "/suppliers",
    },
    {
      title: t("new-supplier"),
      href: "/suppliers/new-supplier",
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

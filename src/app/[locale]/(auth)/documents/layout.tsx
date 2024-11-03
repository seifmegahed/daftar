import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}


export default async function SettingsLayout({
  children,
  params
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("documents.layout");

  const sidebarNavItems = [
    {
      title: t("all-documents"),
      href: "/documents",
    },
    {
      title: t("new-document"),
      href: "/documents/new-document",
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

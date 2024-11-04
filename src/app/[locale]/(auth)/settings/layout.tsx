import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

type SettingsLayoutProps = {
  children: React.ReactNode;
  params: { locale: Locale };
};

async function SettingsLayout({ children, params }: SettingsLayoutProps) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("settings.layout");

  const sidebarNavItems = [
    {
      title: t("profile"),
      href: "/settings",
    },
    {
      title: t("edit"),
      href: "/settings/edit",
    },
    {
      title: t("preferences"),
      href: "/settings/preferences",
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

export default SettingsLayout;

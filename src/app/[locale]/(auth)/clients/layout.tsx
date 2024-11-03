import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

import type { LocaleParams } from "@/i18n/set-locale";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: LocaleParams;
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  setLocale(params.locale);
  const t = await getTranslations("clients.layout");
  const sidebarNavItems = [
    {
      title: t("all-clients"),
      href: "/clients",
    },
    {
      title: t("new-client"),
      href: "/clients/new-client",
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

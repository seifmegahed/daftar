import PageLayout from "@/components/page-layout";
import { setLocale } from "@/i18n/set-locale";
import { isCurrentUserAdminAction } from "@/server/actions/users";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("admin.layout");

  const [admin] = await isCurrentUserAdminAction();
  if (!admin) notFound();

  const links = [
    { title: t("users"), href: "/admin" },
    { title: t("new-user"), href: "/admin/new-user" },
  ];
  return (
    <PageLayout
      title={t("title")}
      description={t("description")}
      navLinks={links}
    >
      {children}
    </PageLayout>
  );
}

export default AdminLayout;

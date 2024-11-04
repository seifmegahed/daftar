import { AvatarContainer } from "@/components/avatar";
import DataDisplayTable from "@/components/data-display-table";
import ErrorPage from "@/components/error";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getCurrentUserAction } from "@/server/actions/users";
import { getInitials } from "@/utils/user";
import { format } from "date-fns";
import { getTranslations, getLocale } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";
import { getLocalizedUserRoleLabel } from "@/data/lut";

async function SettingsProfilePage() {
  const locale = await getLocale() as Locale;
  const t = await getTranslations("settings.profile");
  const dateLocaleFormat = getDateLocaleFormat(locale);

  const [user, error] = await getCurrentUserAction();
  if (error !== null) return <ErrorPage message={error} />;
  return (
    <InfoPageWrapper title={t("title")} subtitle={t("subtitle")}>
      <div className="flex items-center gap-2">
        <AvatarContainer className="size-16 text-2xl">
          {getInitials(user.name)}
        </AvatarContainer>
        <h1 className="text-3xl text-muted-foreground">{user.name}</h1>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <DataDisplayTable
          data={[
            { name: t("name"), value: user.name },
            { name: t("username"), value: user.username },
            { name: t("role"), value: getLocalizedUserRoleLabel(user.role, locale) },
            {
              name: t("created-at"),
              value: format(user.createdAt, "PP", { locale: dateLocaleFormat }),
            },
            {
              name: t("updated-at"),
              value: user.updatedAt
                ? format(user.updatedAt, "PP", { locale: dateLocaleFormat })
                : t("not-available"),
            },
            {
              name: t("last-login"),
              value: user.lastActive
                ? format(user.lastActive, "PP", { locale: dateLocaleFormat })
                : t("not-available"),
            },
          ]}
        />
      </div>
      <p className="max-w-xl text-xs text-muted-foreground">
        {t("description-a")}
        <br></br>
        <br></br>
        {t("description-b")}
        <br></br>
        <br></br>
        {t("description-c")}
      </p>
    </InfoPageWrapper>
  );
}

export default SettingsProfilePage;

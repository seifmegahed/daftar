import CardWrapper from "@/components/card-wrapper";
import { getLocalizedUserRoleLabel } from "@/data/lut";
import type { GetPartialUserType } from "@/server/db/tables/user/queries";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";

function AllUsersList({ users }: { users: GetPartialUserType[] }) {
  return (
    <div className="flex flex-col sm:gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

async function UserCard({ user }: { user: GetPartialUserType }) {
  const locale = await getLocale() as Locale;
  const dateLocaleFormat = getDateLocaleFormat(locale);
  const t = await getTranslations("user-card");
  return (
    <CardWrapper>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
        <div>
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.username}</div>
        </div>
        <div className="flex min-w-48 flex-col gap-1">
          <div className="flex justify-between gap-2 text-sm text-muted-foreground">
            <div>{t("role")}</div>
            <div>{getLocalizedUserRoleLabel(user.role, locale)}</div>
          </div>
          <div className="flex justify-between gap-6 text-sm text-muted-foreground">
            <div>{t("active")}</div>
            <div>{user.active ? t("yes") : t("no")}</div>
          </div>
          <div className="flex justify-between gap-6 text-sm text-muted-foreground">
            <div>{t("last-login")}</div>
            <div>
              {user.lastActive
                ? format(user.lastActive, "PP", { locale: dateLocaleFormat })
                : "-"}
            </div>
          </div>
        </div>
      </div>
      <div className="h-full sm:pb-10">
        <Link href={`/admin/edit-user/${user.id}`}>
          <div className="cursor-pointer text-muted-foreground">
            <Edit className="h-6 w-6" />
          </div>
        </Link>
      </div>
    </CardWrapper>
  );
}

export default AllUsersList;

import { format } from "date-fns";
import DataDisplayUnit from "../data-display-unit";
import { getLocale, getTranslations } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";

const UserInfoSection = async ({
  data,
}: {
  data: {
    createdAt: Date;
    updatedAt?: Date | null;
    creator: { id: number; name: string };
    updater?: { id: number; name: string } | null;
  };
}) => {
  const { createdAt, updatedAt, creator, updater } = data;
  const t = await getTranslations("user-info-section");
  const locale = await getLocale();
  const localeDateFormat = getDateLocaleFormat(locale);
  return (
    <div className="flex flex-col gap-y-2">
      <DataDisplayUnit
        label={t("created-at")}
        values={[format(createdAt, "PP", { locale: localeDateFormat })]}
      />
      <DataDisplayUnit label={t("created-by")} values={[creator.name]} />
      {updater && (
        <>
          <DataDisplayUnit
            label={t("updated-at")}
            values={[
              updatedAt
                ? format(updatedAt, "PP", { locale: localeDateFormat })
                : t("not-available"),
            ]}
          />
          <DataDisplayUnit label={t("updated-by")} values={[updater.name]} />
        </>
      )}
    </div>
  );
};

export default UserInfoSection;

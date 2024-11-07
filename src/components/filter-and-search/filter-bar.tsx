import { projectTypes, statusCodes } from "@/data/lut";
import DateFilter from "./date-filter";
import SelectFilter from "./select-filter";

import type { FilterTypes } from ".";
import { useLocale, useTranslations } from "next-intl";

function FilterBar({
  type,
  defaultValue,
  options = [],
}: {
  type: FilterTypes;
  defaultValue?: string;
  options?: { label: string; value: number }[];
}) {
  const t = useTranslations("filter");
  const locale = useLocale() as Locale;
  const statusOptions = statusCodes.map((x) => ({
    label: x[locale],
    value: x.value,
  }));

  const projectTypeOptions = projectTypes.map((x) => ({
    label: x[locale],
    value: x.value,
  }));

  switch (type) {
    case "status":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={statusOptions}
          type={"status"}
          label={t("status")}
        />
      );
    case "type":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={projectTypeOptions}
          type={"type"}
          label={t("type")}
        />
      );
    case "owner":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={options}
          type={"owner"}
          label={t("owner")}
        />
      );
    case "createdBy":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={options}
          type={"createdBy"}
          label={t("createdBy")}
        />
      );
    case "startDate":
      return <DateFilter defaultValue={defaultValue} type={type} />;
    case "endDate":
      return <DateFilter defaultValue={defaultValue} type={type} />;
    case "creationDate":
      return <DateFilter defaultValue={defaultValue} type={type} />;
    case "updateDate":
      return <DateFilter defaultValue={defaultValue} type={type} />;
    default:
      return null;
  }
}

export default FilterBar;

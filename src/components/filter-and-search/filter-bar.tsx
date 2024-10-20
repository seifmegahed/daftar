import { projectTypes, statusCodes } from "@/data/lut";
import type { FilterTypes } from ".";
import DateFilter from "./date-filter";
import SelectFilter from "./select-filter";

function FilterBar({
  type,
  defaultValue,
}: {
  type: FilterTypes;
  defaultValue?: string;
}) {
  switch (type) {
    case "status":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={statusCodes}
          type={"status"}
          label={"Status"}
        />
      );
    case "type":
      return (
        <SelectFilter
          defaultValue={defaultValue}
          options={projectTypes}
          type={"type"}
          label={"Type"}
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

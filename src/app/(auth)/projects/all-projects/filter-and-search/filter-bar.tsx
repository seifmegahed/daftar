import type { FilterTypes } from ".";
import DateFilter from "./date-filter";
import StatusFilter from "./status-filter";

function FilterBar({
  type,
  defaultValue,
}: {
  type: FilterTypes;
  defaultValue?: string;
}) {
  switch (type) {
    case "status":
      return <StatusFilter defaultValue={defaultValue} />;
    case "startDate":
      return <DateFilter defaultValue={defaultValue}/>;
    case "endDate":
      return<DateFilter defaultValue={defaultValue}/>;
    case "creationDate":
      return <DateFilter defaultValue={defaultValue}/>;
    case "updateDate":
      return <DateFilter defaultValue={defaultValue}/>;
    default:
      return null;
  }
}

export default FilterBar;

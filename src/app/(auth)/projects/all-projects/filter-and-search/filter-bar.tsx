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
      return <DateFilter defaultValue={defaultValue} type={type}/>;
    case "endDate":
      return<DateFilter defaultValue={defaultValue} type={type}/>;
    case "creationDate":
      return <DateFilter defaultValue={defaultValue} type={type}/>;
    case "updateDate":
      return <DateFilter defaultValue={defaultValue} type={type}/>;
    default:
      return null;
  }
}

export default FilterBar;

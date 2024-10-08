import type { FilterTypes } from ".";
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
      return <div>startDate</div>;
    case "endDate":
      return <div>endDate</div>;
    case "creationDate":
      return <div>creationData</div>;
    case "updateDate":
      return <div>updateDate</div>;
    default:
      return null;
  }
}

export default FilterBar;

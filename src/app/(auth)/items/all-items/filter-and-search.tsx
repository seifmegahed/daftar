import { Filter} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";

function FilterAndSearch() {
  return (
    <div className="flex justify-between">
      <SearchBar />
      <Button
        className="flex size-10 items-center justify-center rounded-full text-muted-foreground"
        variant="outline"
      >
        <div>
          <Filter className="h-4 w-4" />
        </div>
      </Button>
    </div>
  );
}

export default FilterAndSearch;

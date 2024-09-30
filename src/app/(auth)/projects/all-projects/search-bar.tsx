"use client";

import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((searchText: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchText) {
      params.set("query", searchText);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex justify-between">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects"
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
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

export default SearchBar;

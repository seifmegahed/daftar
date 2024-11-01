"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";

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

  const t = useTranslations("search-bar");

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t("placeholder")}
        className="pl-8 max-w-[300px] w-full"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}

export default SearchBar;

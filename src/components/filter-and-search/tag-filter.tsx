"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FILTER_TYPE, FILTER_VALUE } from ".";
import { TagsInput } from "../inputs/tags-input";

export const TAGS_SEPARATOR = ",";

export const TagFilter = ({ defaultValue }: { defaultValue?: string }) => {
  const [filterValue, setFilterValue] = useState<string | undefined>(
    defaultValue,
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (filterValue && filterValue !== defaultValue) {
      const params = new URLSearchParams(searchParams);
      params.set(FILTER_TYPE, "tags");
      params.set(FILTER_VALUE, filterValue);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    } else if (!filterValue && searchParams.has(FILTER_TYPE)) {
      const params = new URLSearchParams(searchParams);
      params.delete(FILTER_TYPE);
      params.delete(FILTER_VALUE);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [filterValue, pathname, searchParams, router, defaultValue]);

  return (
    <div>
      <TagsInput
        value={
          filterValue?.split(TAGS_SEPARATOR).filter((x) => x.length > 0) ?? []
        }
        onChange={(tags) => setFilterValue(tags.join(TAGS_SEPARATOR))}
      />
      <p className="text-sm text-muted-foreground">
        Type your tags and press Enter to filter. Use commas to separate
        multiple tags.
      </p>
      {filterValue && filterValue.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Current tags: {filterValue.split(TAGS_SEPARATOR).join(", ")}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">No tags selected</p>
      )}
    </div>
  );
};

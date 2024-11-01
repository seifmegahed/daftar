"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function ComboSelect({
  value,
  onChange = () => {
    return;
  },
  className,
  options,
  selectMessage = "Select",
  searchMessage = "Search",
  notFoundMessage = "No item found.",
}: {
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
  options: { label: string; value: string | number }[];
  selectMessage?: string;
  searchMessage?: string;
  notFoundMessage?: string;
}) {
  const [open, setOpen] = useState(false);

  const valueLabel = options.find((x) => x.value === value)?.label ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className,
            value ? "" : "text-muted-foreground",
          )}
        >
          <p className="truncate">{valueLabel ? valueLabel : selectMessage}</p>
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50 text-secondary-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" >
        <Command className="max-h-[500px] w-full overflow-y-auto">
          <CommandInput placeholder={searchMessage} />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      if (option.value === value) onChange("");
                      else onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboSelect;

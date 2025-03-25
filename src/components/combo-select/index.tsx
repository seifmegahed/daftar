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
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  options: string[] | readonly string[];
  selectMessage?: string;
  searchMessage?: string;
  notFoundMessage?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className,
            value ? "" : "text-muted-foreground",
          )}
        >
          <p className="truncate">{value ?? selectMessage}</p>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-secondary-foreground opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="max-h-[500px] w-full overflow-y-auto">
          <CommandInput placeholder={searchMessage} />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  className="cursor-pointer"
                  onSelect={() => {
                    if (option === value) onChange("");
                    else onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "me-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboSelect;

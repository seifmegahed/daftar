import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import Loading from "@/components/loading";
import type { ReturnTuple } from "@/utils/type-utils";

export const AutoMultiInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string[];
    onChange: (value: string[]) => void;
    getSuggestions: (searchTerm: string) => Promise<ReturnTuple<string[]>>;
  }
>(({ value, onChange, getSuggestions }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [popoverTop, setPopoverTop] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const innerInputRef = useRef<HTMLInputElement>(null);

  // Merge the forwarded ref with the internal one
  useEffect(() => {
    if (typeof ref === "function") {
      ref(innerInputRef.current);
    } else if (ref) {
      ref.current = innerInputRef.current;
    }
  }, [ref]);

  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      (async () => {
        const trimmed = inputValue.trim();
        if (!trimmed) {
          setSuggestions([]);
          return;
        }

        setLoading(true);
        const [data, error] = await getSuggestions(trimmed);
        setLoading(false);

        if (error !== null) {
          console.error("Error fetching suggestions:", error);
          return;
        }
        setSuggestions(data || []);
        setSelectedIndex(-1);
      })().catch((error) => {
        console.error("Error in tag suggestions effect:", error);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, getSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addValue(inputValue);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const lastIndex = suggestions.length - 1;

        if (prev === -1) {
          // First press → decide starting point
          return popoverTop
            ? lastIndex // Start from end if popover is on top
            : 0; // Start from beginning if popover is on bottom
        }

        // Normal navigation
        if (e.key === "ArrowDown") {
          return Math.min(prev + 1, lastIndex);
        } else {
          return Math.max(prev - 1, 0);
        }
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex === -1 || selectedIndex === suggestions.length) {
        addValue(inputValue);
        return;
      }
      const selectedValue = suggestions[selectedIndex];
      if (!selectedValue) return; // Prevent adding undefined values
      addValue(selectedValue);
      return;
    }
  };

  const addValue = (newValue: string) => {
    const trimmedValue = newValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
    }
    setInputValue("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    // track input element position to adjust popover anchor position
    const inputElement = innerInputRef.current;
    if (!inputElement) return;
    const updatePopoverPosition = () => {
      const rect = inputElement.getBoundingClientRect();
      const isInTopHalf = rect.top < window.innerHeight / 2;
      setPopoverTop(!isInTopHalf); // <- Anchor *top* when in bottom half
    };

    window.addEventListener("scroll", updatePopoverPosition);
    window.addEventListener("resize", updatePopoverPosition);
    updatePopoverPosition();

    return () => {
      window.removeEventListener("scroll", updatePopoverPosition);
      window.removeEventListener("resize", updatePopoverPosition);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        onKeyDown={handleKeyDown}
        value={
          selectedIndex === -1 || selectedIndex === suggestions.length
            ? inputValue
            : suggestions[selectedIndex]
        }
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelectedIndex(-1);
        }}
        ref={innerInputRef}
      />
      <AutocompleteBox
        anchorTop={popoverTop}
        open={!!inputValue && !!suggestions.length}
        onHover={() => setSelectedIndex(-1)}
        loading={loading}
      >
        {suggestions.map((option, index) => (
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b border-muted p-3 last:border-none hover:bg-muted-foreground/20",
              index === selectedIndex && "bg-muted-foreground/20",
            )}
            key={option}
            onClick={() => addValue(option)}
          >
            <span className="text-xs text-muted-foreground">{option}</span>
          </div>
        ))}
      </AutocompleteBox>
    </div>
  );
});

AutoMultiInput.displayName = "AutoMultiInput";

const AutocompleteBox = ({
  children,
  anchorTop,
  open = false,
  onHover,
  loading,
}: {
  children: React.ReactNode;
  anchorTop?: boolean;
  open?: boolean;
  onHover?: () => void;
  loading?: boolean;
}) => {
  return (
    <div className="relative w-full" onMouseOver={onHover}>
      <div
        className={cn(
          "absolute left-0 z-10 w-full overflow-clip rounded-sm border bg-background shadow-md",
          anchorTop ? "bottom-full mb-12" : "top-full -mt-1",
          open ? "block" : "hidden",
        )}
      >
        {loading ? (
          <div className="p-4">
            <Loading className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex flex-col">{children}</div>
        )}
      </div>
    </div>
  );
};

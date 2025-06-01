import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export const AutoMultiInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string[];
    onChange: (value: string[]) => void;
  }
>(({ value, onChange }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [popoverTop, setPopoverTop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const innerInputRef = useRef<HTMLInputElement>(null);

  // Merge the forwarded ref with the internal one
  useEffect(() => {
    if (typeof ref === "function") {
      ref(innerInputRef.current);
    } else if (ref) {
      ref.current = innerInputRef.current;
    }
  }, [ref]);

  const handleRemoveTag = (tag: string) =>
    onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addValue(inputValue);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const newIndex =
          e.key === "ArrowDown"
            ? Math.min(prev + 1, value.length - 1)
            : Math.max(prev - 1, -1);
        return newIndex;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex === -1) {
        addValue(inputValue);
        return;
      }
      const selectedValue = value[selectedIndex];
      if (!selectedValue) return; // Prevent adding undefined values
      addValue(selectedValue);
      setInputValue("");
      return;
    }
  };

  const addValue = (newValue: string) => {
    const trimmedValue = newValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    } else {
      // If the tag already exists, just clear the input
      setInputValue("");
    }
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
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <RemovableTag
            key={tag}
            tag={tag}
            onRemove={() => handleRemoveTag(tag)}
          />
        ))}
      </div>
      <Input
        onKeyDown={handleKeyDown}
        value={selectedIndex === -1 ? inputValue : value[selectedIndex]}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelectedIndex(-1);
        }}
        ref={innerInputRef}
      />
      <AutocompleteBox
        anchorTop={popoverTop}
        open={!!inputValue && !!value.length}
        onHover={() => setSelectedIndex(-1)}
      >
        {value.map((tag, index) => (
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b border-muted p-3 last:border-none hover:bg-muted-foreground/20",
              index === selectedIndex && "bg-muted-foreground/20",
            )}
            key={tag}
            onClick={() => addValue(tag)}
          >
            <span className="text-xs text-muted-foreground">{tag}</span>
          </div>
        ))}
      </AutocompleteBox>
    </div>
  );
});

AutoMultiInput.displayName = "AutoMultiInput";

const RemovableTag = ({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
      <span className="text-xs font-medium">{tag}</span>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

const AutocompleteBox = ({
  children,
  anchorTop,
  open = false,
  onHover,
}: {
  children: React.ReactNode;
  anchorTop?: boolean;
  open?: boolean;
  onHover?: () => void;
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
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
};

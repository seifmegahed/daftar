import React from "react";
import { X } from "lucide-react";
import { AutoMultiInput } from "../auto-multi";
import { getTagSuggestionsAction } from "@/server/actions/tags/read";

export const TagsInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string[];
    onChange: (value: string[]) => void;
  }
>(({ value, onChange }, ref) => {
  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex w-full flex-wrap gap-2">
        {value.map((tag) => (
          <RemovableTag
            key={tag}
            tag={tag}
            onRemove={() => handleRemoveTag(tag)}
          />
        ))}
      </div>
      <AutoMultiInput
        value={value}
        onChange={onChange}
        ref={ref}
        getSuggestions={getTagSuggestionsAction}
      />
    </div>
  );
});

TagsInput.displayName = "TagsInput";

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

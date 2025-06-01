export const TagsSection = ({
  tags,
}: {
  tags: { name: string; id: number }[];
}) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <div
        key={tag.id}
        className="rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground"
      >
        {tag.name}
      </div>
    ))}
  </div>
);

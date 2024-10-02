import { defaultPageLimit } from "@/data/config";
import { SkeletonCardA } from "./card-a";
import { SkeletonCardB } from "./card-b";

export default function SkeletonList({
  pageLimit = defaultPageLimit,
  type,
}: {
  pageLimit?: number;
  type: "A" | "B";
}) {
  switch (type) {
    case "A":
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: pageLimit }).map((_, i) => (
            <SkeletonCardA key={"skeleton-card-" + i} />
          ))}
        </div>
      );
    case "B":
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: pageLimit }).map((_, i) => (
            <SkeletonCardB key={"skeleton-card-" + i} />
          ))}
        </div>
      );
    default:
      return <div>Error: Invalid type</div>;
  }
}

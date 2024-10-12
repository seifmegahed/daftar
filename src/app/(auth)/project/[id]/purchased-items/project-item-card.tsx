import { getCurrencyLabel } from "@/data/lut";
import { type GetProjectItemType } from "@/server/db/tables/project-item/queries";
import Link from "next/link";
import ProjectItemCardContextMenu from "./project-item-card-menu";

function ProjectItemCard({
  projectItem,
  index,
}: {
  projectItem: GetProjectItemType;
  index: number;
}) {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <div className="flex cursor-pointer items-center justify-center">
        <p className="w-6 text-right text-2xl font-bold text-foreground">
          {index + 1}
        </p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full flex-shrink items-center justify-between">
          <div>
            <Link href={`/item/${projectItem.item.id}`}>
              <p className="line-clamp-1 cursor-pointer text-foreground hover:underline">
                {projectItem.item.name}
              </p>
            </Link>
            <Link href={`/item/${projectItem.item.id}`}>
              <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
                {projectItem.item.make}
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full flex-grow text-end">
          <Link href={`/supplier/${projectItem.supplier.id}`}>
            <p className="line-clamp-1 cursor-pointer hover:underline">
              {projectItem.supplier.name}
            </p>
          </Link>
          <div className="flex justify-end gap-3">
            <p className="cursor-pointer text-xs text-muted-foreground">
              {"PPU: (" +
                getCurrencyLabel(projectItem.currency) +
                ") " +
                projectItem.price}
            </p>
            <p className="cursor-pointer text-xs text-muted-foreground">
              Quantity: {projectItem.quantity}
            </p>
          </div>
        </div>
      </div>
      <ProjectItemCardContextMenu
        projectItemId={projectItem.id}
        itemId={projectItem.item.id}
        supplierId={projectItem.supplier.id}
      />
    </div>
  );
}

export default ProjectItemCard;

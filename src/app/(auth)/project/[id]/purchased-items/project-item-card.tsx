import { getCurrencyLabel } from "@/data/lut";
import { type GetProjectItemType } from "@/server/db/tables/project-item/queries";
import Link from "next/link";
import ProjectItemCardContextMenu from "./project-item-card-menu";
import CardWrapper from "@/components/card-wrapper";

function ProjectItemCard({
  projectItem,
  index,
}: {
  projectItem: GetProjectItemType;
  index: number;
}) {
  return (
    <CardWrapper>
      <Link
        className="hidden cursor-pointer items-center justify-center sm:flex"
        href={`/item/${projectItem.item.id}`}
      >
        <p className="w-6 text-right text-2xl font-bold text-foreground">
          {index + 1}
        </p>
      </Link>
      <div className="flex w-full flex-col sm:items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
        <div className="flex w-full items-center justify-between">
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
        <div className="sm:w-60 sm:text-end">
          <Link href={`/supplier/${projectItem.supplier.id}`}>
            <p className="line-clamp-1 cursor-pointer hover:underline">
              {projectItem.supplier.name}
            </p>
          </Link>
          <div className="flex sm:justify-end gap-3">
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
    </CardWrapper>
  );
}

export default ProjectItemCard;

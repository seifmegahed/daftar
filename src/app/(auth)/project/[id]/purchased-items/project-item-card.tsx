import { getCurrencyLabel } from "@/data/lut";
import { type GetProjectItemType } from "@/server/db/tables/project-item/queries";
import ProjectItemCardContextMenu from "./project-item-card-menu";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardIndexSection,
  CardMenuContainer,
  CardNameSection,
  CardSection,
  CardSubtitleSection,
} from "@/components/card-sections";

function ProjectItemCard({
  projectItem,
  index,
}: {
  projectItem: GetProjectItemType;
  index: number;
}) {
  return (
    <CardWrapper>
      <CardIndexSection index={index + 1} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={projectItem.item.name}
            href={`/item/${projectItem.item.id}`}
          />
          <CardSubtitleSection subtitle={projectItem.item.make} tip="Make" />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={projectItem.supplier.name}
            tip="Supplier"
            href={`/supplier/${projectItem.supplier.id}`}
          />
          <div className="flex gap-3 sm:justify-end">
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
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <ProjectItemCardContextMenu
          projectItemId={projectItem.id}
          itemId={projectItem.item.id}
          supplierId={projectItem.supplier.id}
        />
      </CardMenuContainer>
    </CardWrapper>
  );
}

export default ProjectItemCard;

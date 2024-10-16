import type { SupplierItemType } from "@/server/db/tables/project-item/queries";
import { numberWithCommas } from "@/utils/common";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardIdSection,
  CardNameSection,
  CardSection,
  CardSubtitleSection,
} from "@/components/card-sections";

const SupplierItemCard = ({ item }: { item: SupplierItemType }) => {
  return (
    <CardWrapper>
      <CardIdSection id={item.itemId} href={`/item/${item.itemId}`} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection name={item.itemName} href={`/item/${item.itemId}`} />
          <CardSubtitleSection subtitle={item.itemMake} tip="Make" />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={item.projectName}
            href={`/project/${item.projectId}`}
            tip="Project"
          />
          <div className="flex gap-4 sm:justify-end">
            <p className="text-xs text-muted-foreground">
              {"Quantity: " + item.quantity}
            </p>
            <p className="min-w-24 text-xs text-muted-foreground">
              {"Price: " + numberWithCommas(Number(item.price))}
            </p>
          </div>
        </CardBodyEndContainer>
      </CardBodyContainer>
    </CardWrapper>
  );
};

export default SupplierItemCard;
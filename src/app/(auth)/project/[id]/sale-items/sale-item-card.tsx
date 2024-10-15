import { getCurrencyLabel } from "@/data/lut";
import SaleItemCardMenu from "./sale-item-card-menu";
import type { SaleItemType } from "@/server/db/tables/commercial-offer-item/queries";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardIndexSection,
  CardMenuContainer,
  CardNameSection,
  CardSubtitleSection,
} from "@/components/card-sections";

function SaleItemCard({
  saleItem,
  index,
}: {
  saleItem: SaleItemType;
  index: number;
}) {
  return (
    <CardWrapper>
      <CardIndexSection index={index + 1} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={saleItem.name}
            href={`/item/${saleItem.itemId}`}
          />
          <CardSubtitleSection subtitle={saleItem.make} tip="Make" />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <div className="sm:w-36 sm:text-end">
            <p className="cursor-pointer text-xs text-muted-foreground">
              {"PPU: (" +
                getCurrencyLabel(saleItem.currency) +
                ") " +
                saleItem.price}
            </p>
            <p className="cursor-pointer text-xs text-muted-foreground">
              Quantity: {saleItem.quantity}
            </p>
          </div>
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <SaleItemCardMenu saleItemId={saleItem.id} itemId={saleItem.itemId} />
      </CardMenuContainer>
    </CardWrapper>
  );
}

export default SaleItemCard;

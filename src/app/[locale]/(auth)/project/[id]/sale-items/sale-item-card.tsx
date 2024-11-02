import { getCurrencyLabel } from "@/data/lut";
import SaleItemCardMenu from "./sale-item-card-menu";
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

import type { SaleItemType } from "@/server/db/tables/sale-item/queries";
import { useTranslations } from "next-intl";

function SaleItemCard({
  saleItem,
  index,
}: {
  saleItem: SaleItemType;
  index: number;
}) {
  const t = useTranslations("project.sale-items-page.card");
  return (
    <CardWrapper>
      <CardIndexSection index={index + 1} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={saleItem.name}
            href={`/item/${saleItem.itemId}`}
          />
          <CardSubtitleSection subtitle={saleItem.make} tip={t("make")} />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <div className="sm:w-36 sm:text-end">
            <p className="cursor-pointer text-xs text-muted-foreground">
              {t("ppu", { currency: getCurrencyLabel(saleItem.currency), price: saleItem.price })}
            </p>
            <p className="cursor-pointer text-xs text-muted-foreground">
              {t("quantity", { quantity: saleItem.quantity })}
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

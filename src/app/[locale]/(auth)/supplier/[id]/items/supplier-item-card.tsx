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
import { getTranslations } from "next-intl/server";

import type { SupplierItemType } from "@/server/db/tables/purchase-item/queries";
import { getCurrencyLabel } from "@/data/lut";

const SupplierItemCard = async ({ item }: { item: SupplierItemType }) => {
  const t = await getTranslations("supplier-item-card");

  return (
    <CardWrapper>
      <CardIdSection id={item.itemId} href={`/item/${item.itemId}`} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection name={item.itemName} href={`/item/${item.itemId}`} />
          <CardSubtitleSection subtitle={item.itemMake} tip={t("make")} />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={item.projectName}
            href={`/project/${item.projectId}`}
            tip={t("project")}
          />
          <div className="flex gap-4 sm:justify-end">
            <p className="text-xs text-muted-foreground">
              {t("quantity", { quantity: item.quantity })}
            </p>
            <p className="min-w-24 text-xs text-muted-foreground">
              {t("ppu", {
                price: numberWithCommas(parseFloat(item.price)),
                currency: getCurrencyLabel(item.currency),
              })}
            </p>
          </div>
        </CardBodyEndContainer>
      </CardBodyContainer>
    </CardWrapper>
  );
};

export default SupplierItemCard;

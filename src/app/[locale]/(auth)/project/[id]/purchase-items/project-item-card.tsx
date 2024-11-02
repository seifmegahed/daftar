import { getCurrencyLabel } from "@/data/lut";
import type { GetPurchaseItemType } from "@/server/db/tables/purchase-item/queries";
import PurchaseItemCardContextMenu from "./project-item-card-menu";
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
import { getTranslations } from "next-intl/server";

async function PurchaseItemCard({
  projectItem,
  index,
}: {
  projectItem: GetPurchaseItemType;
  index: number;
}) {
  const t = await getTranslations("project.purchase-items-page.card");
  return (
    <CardWrapper>
      <CardIndexSection index={index + 1} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={projectItem.item.name}
            href={`/item/${projectItem.item.id}`}
          />
          <CardSubtitleSection
            subtitle={projectItem.item.make}
            tip={t("make")}
          />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={projectItem.supplier.name}
            tip={t("supplier")}
            href={`/supplier/${projectItem.supplier.id}`}
          />
          <div className="flex gap-3 sm:justify-end">
            <p className="cursor-pointer text-xs text-muted-foreground">
              {t("ppu", {
                currency: getCurrencyLabel(projectItem.currency),
                price: projectItem.price,
              })}
            </p>
            <p className="cursor-pointer text-xs text-muted-foreground">
              {t("quantity", { quantity: projectItem.quantity })}
            </p>
          </div>
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <PurchaseItemCardContextMenu
          projectItemId={projectItem.id}
          itemId={projectItem.item.id}
          supplierId={projectItem.supplier.id}
        />
      </CardMenuContainer>
    </CardWrapper>
  );
}

export default PurchaseItemCard;

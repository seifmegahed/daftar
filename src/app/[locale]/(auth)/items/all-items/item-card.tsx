import ItemCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";
import { useTranslations } from "next-intl";

import type { BriefItemType } from "@/server/db/tables/item/queries";

import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardCreatedAtSection,
  CardIdSection,
  CardMenuContainer,
  CardNameSection,
  CardSubtitleSection,
} from "@/components/card-sections";

const ItemCard = ({ item }: { item: BriefItemType }) => {
  const t = useTranslations("item-card.tips");
  return (
    <CardWrapper>
      <CardIdSection href={`/item/${item.id}`} id={item.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection name={item.name} href={`/item/${item.id}`} />
          <CardSubtitleSection subtitle={item.make} tip={t("make")} />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardCreatedAtSection date={item.createdAt} />
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <ItemCardContextMenu itemId={item.id} />
      </CardMenuContainer>
    </CardWrapper>
  );
};

export default ItemCard;

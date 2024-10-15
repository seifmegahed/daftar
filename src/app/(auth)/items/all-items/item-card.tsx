import { type BriefItemType } from "@/server/db/tables/item/queries";
import ItemCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

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
  return (
    <CardWrapper>
      <CardIdSection href={`/item/${item.id}`} id={item.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection name={item.name} href={`/item/${item.id}`} />
          <CardSubtitleSection subtitle={item.make} tip="Make" />
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

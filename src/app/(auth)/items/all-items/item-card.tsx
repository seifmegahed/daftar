"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type BriefItemType } from "@/server/db/tables/item/queries";
import ItemCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

const ItemCard = ({ item }: { item: BriefItemType }) => {
  return (
    <CardWrapper>
      <Link href={`/item/${item.id}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-end text-2xl font-bold text-foreground">
            {item.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <div>
          <Link href={`/item/${item.id}`}>
            <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
              {item.name}
            </p>
          </Link>
          <p className="cursor-pointer text-xs text-muted-foreground">
            {item.make}
          </p>
        </div>
        <div className="sm:w-56 sm:text-end">
          <p className="line-clamp-1 text-foreground">{item.type}</p>
          <p className="text-xs text-muted-foreground">
            {format(item.createdAt, "PP")}
          </p>
        </div>
      </div>
      <div>
        <ItemCardContextMenu itemId={item.id} />
      </div>
    </CardWrapper>
  );
};

export default ItemCard;

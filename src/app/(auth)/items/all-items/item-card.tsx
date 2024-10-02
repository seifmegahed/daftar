"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type BriefItemType } from "@/server/db/tables/item/queries";
import ItemCardContextMenu from "./card-menu";

const ItemCard = ({ item }: { item: BriefItemType }) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/item/${item.id}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {item.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <div>
          <Link href={`/item/${item.id}`}>
            <p className="line-clamp-1 cursor-pointer text-foreground hover:underline">
              {item.name}
            </p>
          </Link>
          <p className="cursor-pointer text-xs text-muted-foreground">
            {item.make}
          </p>
        </div>
        <div className="w-56 text-right">
          <p className="line-clamp-1 text-foreground">{item.type}</p>
          <p className="text-xs text-muted-foreground">
            {format(item.createdAt, "PP")}
          </p>
        </div>
      </div>
      <ItemCardContextMenu itemId={item.id} />
    </div>
  );
};

export default ItemCard;

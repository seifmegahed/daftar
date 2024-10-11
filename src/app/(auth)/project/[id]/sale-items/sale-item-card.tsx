import { getCurrencyLabel } from "@/data/lut";
import Link from "next/link";
import SaleItemCardMenu from "./sale-item-card-menu";
import type { SaleItemType } from "@/server/db/tables/commercial-offer-item/queries";

function SaleItemCard({
  saleItem,
  index,
}: {
  saleItem: SaleItemType;
  index: number;
}) {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <div className="flex cursor-pointer items-center justify-center">
        <p className="w-6 text-right text-2xl font-bold text-foreground">
          {index + 1}
        </p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full flex-shrink items-center justify-between">
          <div>
            <Link href={`/item/${saleItem.id}`}>
              <p className="line-clamp-1 cursor-pointer text-foreground hover:underline">
                {saleItem.name}
              </p>
            </Link>
            <Link href={`/item/${saleItem.id}`}>
              <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
                {saleItem.make}
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full flex-grow text-right">
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
      </div>
      <SaleItemCardMenu saleItemId={saleItem.id} itemId={saleItem.itemId} />
    </div>
  );
}

export default SaleItemCard;

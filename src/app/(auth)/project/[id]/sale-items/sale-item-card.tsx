import { getCurrencyLabel } from "@/data/lut";
import Link from "next/link";
import SaleItemCardMenu from "./sale-item-card-menu";
import type { SaleItemType } from "@/server/db/tables/commercial-offer-item/queries";
import CardWrapper from "@/components/card-wrapper";

function SaleItemCard({
  saleItem,
  index,
}: {
  saleItem: SaleItemType;
  index: number;
}) {
  return (
    <CardWrapper>
      <Link
        href={`/item/${saleItem.itemId}`}
        className="hidden cursor-pointer items-center justify-center sm:flex"
      >
        <p className="w-6 text-right text-2xl font-bold text-foreground">
          {index + 1}
        </p>
      </Link>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full items-center">
          <div>
            <Link href={`/item/${saleItem.itemId}`}>
              <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
                {saleItem.name}
              </p>
            </Link>
            <Link href={`/item/${saleItem.itemId}`}>
              <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
                {saleItem.make}
              </p>
            </Link>
          </div>
        </div>
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
      </div>
      <SaleItemCardMenu saleItemId={saleItem.id} itemId={saleItem.itemId} />
    </CardWrapper>
  );
}

export default SaleItemCard;

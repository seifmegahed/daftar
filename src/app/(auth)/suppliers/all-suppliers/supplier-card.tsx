"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type BriefSupplierType } from "@/server/db/tables/supplier/queries";
import SupplierCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

const SupplierCard = ({ supplier }: { supplier: BriefSupplierType }) => {
  return (
    <CardWrapper>
      {/* <div className="flex items-center gap-5 rounded-xl border p-4"> */}
      <Link href={`/supplier/${supplier.id}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {supplier.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <div>
          <Link href={`/supplier/${supplier.id}`}>
            <p className="line-clamp-1 cursor-pointer text-foreground hover:underline font-bold text-lg">
              {supplier.name}
            </p>
          </Link>
          <p className="cursor-pointer text-xs text-muted-foreground">
            {supplier.field}
          </p>
        </div>
        <div className="sm:w-56 sm:text-end">
          <p className="line-clamp-1 text-foreground">
            {supplier.registrationNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(supplier.createdAt, "PP")}
          </p>
        </div>
      </div>
      <SupplierCardContextMenu supplierId={supplier.id} />
      {/* </div> */}
    </CardWrapper>
  );
};

export default SupplierCard;

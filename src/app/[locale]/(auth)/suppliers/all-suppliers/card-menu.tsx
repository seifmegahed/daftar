"use client";

import { Link } from "@/i18n/routing";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/utils/common";

const SupplierCardContextMenu = ({ supplierId }: { supplierId: number }) => {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("supplier-card.menu");
  
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem>{t("supplier-page")}</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}/documents`}>
          <DropdownMenuItem>{t("supplier-documents")}</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/supplier/${supplierId}/edit`}>
          <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">{t("delete")}</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SupplierCardContextMenu;

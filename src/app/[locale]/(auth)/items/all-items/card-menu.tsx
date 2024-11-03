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

const ItemCardContextMenu = ({ itemId }: { itemId: number }) => {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("item-card.menu");
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/item/${itemId}`}>
          <DropdownMenuItem>{t("item-page")}</DropdownMenuItem>
        </Link>
        <Link href={`/item/${itemId}/documents`}>
          <DropdownMenuItem>{t("item-documents")}</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/item/${itemId}/edit`}>
          <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
        </Link>
        <Link href={`/item/${itemId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">{t("delete")}</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemCardContextMenu;

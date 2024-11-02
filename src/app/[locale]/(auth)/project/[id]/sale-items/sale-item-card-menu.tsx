"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteSaleItemAction } from "@/server/actions/sale-items/delete";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/routing";

import { toast } from "sonner";

import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const SaleItemCardMenu = ({
  itemId,
  saleItemId,
}: {
  itemId: number;
  saleItemId: number;
}) => {
  const locale = useLocale();
  const t = useTranslations("project.sale-items-page.card.menu");
  const direction = getDirection(locale);
  const handleDelete = async () => {
    const result = confirm(
      t("confirm-delete"),
    );
    if (!result) return;
    try {
      const [, error] = await deleteSaleItemAction(saleItemId);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    }
  };
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/item/${itemId}`}>
          <DropdownMenuItem className="cursor-pointer">
            {t("item-page")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          <p className="text-red-500">{t("delete")}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SaleItemCardMenu;

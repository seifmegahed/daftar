"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePurchaseItemAction } from "@/server/actions/purchase-items/delete";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/routing";

import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/utils/common";

const ProjectItemCardContextMenu = ({
  itemId,
  supplierId,
  projectItemId,
}: {
  itemId: number;
  supplierId: number;
  projectItemId: number;
}) => {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("project.purchase-items-page.card.menu");
  const handleDelete = async () => {
    const result = confirm(t("confirm-delete"));
    if (!result) return;
    try {
      const [, error] = await deletePurchaseItemAction(projectItemId);
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
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem className="cursor-pointer">
            {t("supplier-page")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          <p className="text-red-500">{t("delete")}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectItemCardContextMenu;

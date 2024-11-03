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

const ClientCardContextMenu = ({ clientId }: { clientId: number }) => {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("client-card.menu");
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/client/${clientId}`}>
          <DropdownMenuItem>{t("client-page")}</DropdownMenuItem>
        </Link>
        <Link href={`/client/${clientId}/documents`}>
          <DropdownMenuItem>{t("client-documents")}</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/client/${clientId}/edit`}>
          <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
        </Link>
        <Link href={`/client/${clientId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">{t("delete")}</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientCardContextMenu;

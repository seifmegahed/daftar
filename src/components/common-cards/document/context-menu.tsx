"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unlinkDocumentAction } from "@/server/actions/document-relations/delete";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import APILink from "next/link";
import { Link, usePathname } from "@/i18n/routing";

import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const DocumentCardContextMenu = ({ document }: { document: SimpDoc }) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("document-alt-card.menu");
  const direction = getDirection(locale);

  const handleUnlink = async () => {
    if (!document.relationId) return;
    try {
      const [, error] = await unlinkDocumentAction(
        document.relationId,
        pathname,
      );
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("unlink-success"));
    } catch (error) {
      console.log(error);
      toast.error(t("unlink-error"));
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
        <Link href={`/document/${document.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            {t("document-page")}
          </DropdownMenuItem>
        </Link>
        <APILink href={`/api/download-document/${document.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            {t("download-document")}
          </DropdownMenuItem>
        </APILink>
        {document.relationId ? (
          <DropdownMenuItem className="cursor-pointer" onClick={handleUnlink}>
            <p className="text-red-500">{t("unlink-document")}</p>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentCardContextMenu;

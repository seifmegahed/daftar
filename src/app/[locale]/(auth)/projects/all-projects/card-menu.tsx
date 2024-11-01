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
import { useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";
import { useLocale } from "next-intl";

const ProjectCardContextMenu = ({ projectId }: { projectId: number }) => {
  const t = useTranslations("project-card.menu");
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/project/${projectId}`}>
          <DropdownMenuItem>{t("project-page")}</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/documents`}>
          <DropdownMenuItem>{t("project-documents")}</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/comments`}>
          <DropdownMenuItem>{t("project-comments")}</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/project/${projectId}/edit`}>
          <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">{t("delete")}</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectCardContextMenu;

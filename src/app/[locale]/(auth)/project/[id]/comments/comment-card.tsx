"use client";

import { AvatarContainer } from "@/components/avatar";
import { getInitials } from "@/utils/user";
import { formatDistanceToNow } from "date-fns";
import type { ProjectCommentType } from "@/server/db/tables/project-comment/queries";
import { X } from "lucide-react";
import { toast } from "sonner";
import { deleteProjectCommentAction } from "@/server/actions/project-comments/delete";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDateLocaleFormat } from "@/utils/common";
import { useTranslations, useLocale } from "next-intl";

function ProjectCommentCard({
  comment,
  userId,
  projectId,
}: {
  comment: ProjectCommentType;
  userId: number;
  projectId: number;
}) {
  const locale = useLocale();
  const t = useTranslations("project.comments-page");
  const localeDateFormat = getDateLocaleFormat(locale);

  const sameUser = comment.userId === userId;

  const handleDelete = async () => {
    if (!sameUser) return;
    try {
      const [, error] = await deleteProjectCommentAction(comment.id, projectId);
      if (error !== null) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(t("delete-error"));
    }
  };
  return (
    <div className="flex w-full max-w-full gap-4">
      <Tooltip>
        <AvatarContainer>
          <TooltipTrigger>{getInitials(comment.userName)}</TooltipTrigger>
        </AvatarContainer>
        <TooltipContent sideOffset={20}>
          <p>{comment.userName}</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex w-full max-w-full flex-col gap-2 rounded-lg bg-muted p-4">
        <div className="flex w-full items-start justify-between">
          <div className="w-full max-w-[80%] flex-shrink">
            <p className="">{comment.text}</p>
          </div>
          {sameUser && (
            <div className="-me-2 -mt-2">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                onClick={handleDelete}
              >
                <X className="h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-muted-foreground">
            {t("comment-date", {
              time: formatDistanceToNow(comment.createdAt, {
                locale: localeDateFormat,
              }),
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCommentCard;

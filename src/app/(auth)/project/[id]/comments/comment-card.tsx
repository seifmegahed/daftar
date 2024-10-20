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

function ProjectCommentCard({
  comment,
  userId,
  projectId,
}: {
  comment: ProjectCommentType;
  userId: number;
  projectId: number;
}) {
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
      toast.error("An error occurred while deleting the comment");
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
      <div className="flex w-full flex-col gap-2 rounded-lg bg-muted p-4 max-w-full">
        <div className="flex w-full items-start justify-between">
          <div className="flex-shrink w-full max-w-[80%]">
            <p className="">
              {comment.text}
            </p>
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
            {formatDistanceToNow(comment.createdAt) + " ago"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCommentCard;

"use client";

import { toast } from "sonner";
import { useRef, useState } from "react";
import { createProjectCommentAction } from "@/server/actions/project-comments/create";
import { SendHorizontal } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/utils/common";

const commentMaxLength = 256;

function ProjectCommentForm({ projectId }: { projectId: number }) {
  const locale = useLocale();
  const direction = getDirection(locale);
  const t = useTranslations("project.comments-page");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (submitting) return;
    if (text.length === 0) return;
    if (text.length > commentMaxLength) {
      toast.error(t("comment-max", { max: commentMaxLength }));
      return;
    }
    setSubmitting(true);
    try {
      const [, error] = await createProjectCommentAction({
        projectId,
        text,
        createdAt: new Date(),
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      setText("");
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!inputRef.current) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <textarea
        className={`w-full resize-none rounded-lg border bg-background px-4 py-2 outline-none ring-0 ${submitting ? "text-muted-foreground caret-transparent opacity-50" : ""}`}
        placeholder={t("placeholder")}
        value={text}
        rows={3}
        onKeyDown={!submitting ? handleKeyDown : undefined}
        onChange={(e) =>
          !submitting &&
          setText((prev) =>
            e.target.value.length > 256 ? prev : e.target.value,
          )
        }
        ref={inputRef}
      />
      <button type="submit" disabled={submitting}>
        <SendHorizontal
          className={`absolute end-2 top-2 h-6 w-6 text-muted-foreground/70 ${submitting ? "opacity-50" : "cursor-pointer"} ${direction === "rtl" ? "rotate-180" : ""}`}
        />
      </button>
    </form>
  );
}

export default ProjectCommentForm;

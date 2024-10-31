"use client";

import { toast } from "sonner";
import { useRef, useState } from "react";
import { createProjectCommentAction } from "@/server/actions/project-comments/create";
import { SendHorizontal } from "lucide-react";

function ProjectCommentForm({ projectId }: { projectId: number }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (submitting) return;
    if (text.length === 0) return;
    if (text.length > 256) {
      toast.error("Comment must be less than 256 characters");
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
      toast.error("An error occurred while adding the comment");
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
        placeholder="Add a comment..."
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
          className={`absolute end-2 top-2 h-6 w-6 text-muted-foreground/70 ${submitting ? "opacity-50" : "cursor-pointer"}`}
        />
      </button>
    </form>
  );
}

export default ProjectCommentForm;

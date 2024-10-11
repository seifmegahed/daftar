"use client";

import { toast } from "sonner";
import { useRef, useState } from "react";
import { createProjectCommentAction } from "@/server/actions/project-comments/create";
import { SendHorizontal } from "lucide-react";

function ProjectCommentForm({ projectId }: { projectId: number }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (text.length === 0) return;
    if (text.length > 256) {
      toast.error("Comment must be less than 256 characters");
      return;
    }
    try {
      const [, error] = await createProjectCommentAction({
        projectId,
        text,
        createdAt: new Date(),
      });
      if (error !== null) {
        console.log(error);
        toast.error("Error creating comment");
        return;
      }
      setText("");
    } catch (error) {
      console.log(error);
      toast.error("Error creating comment");
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
        className="w-full resize-none rounded-lg border px-4 py-2 outline-none ring-0 bg-background"
        placeholder="Add a comment..."
        value={text}
        rows={3}
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
        ref={inputRef}
      />
      <button type="submit">
        <SendHorizontal className="absolute right-2 top-2 h-6 w-6 text-muted-foreground/70" />
      </button>
    </form>
  );
}

export default ProjectCommentForm;

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type AvatarProps = {
  children: ReactNode;
  className?: string;
};

export const AvatarContainer = ({ children, className }: AvatarProps) => (
  <div
    className={cn(
      "text-md flex size-10 shrink-0 select-none items-center justify-center rounded-full bg-muted text-muted-foreground",
      className,
    )}
  >
    <div>{children}</div>
  </div>
);

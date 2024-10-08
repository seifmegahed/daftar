import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type AvatarProps = {
  children: ReactNode;
  className?: string;
};

export const AvatarContainer = ({ children, className }: AvatarProps) => (
  <div
    className={cn(
      "text-md flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-1000 ease-in-out group-hover:bg-white group-data-[state=active]:bg-white",
      className,
    )}
  >
    <div>{children}</div>
  </div>
);

export const AdminUserAvatarContainer = ({
  children,
  className,
}: AvatarProps) => (
  <div
    className={cn(
      "text-md flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-muted-foreground",
      className,
    )}
  >
    <div>{children}</div>
  </div>
);

export const DeactivatedUserAvatarContainer = ({
  children,
  className,
}: AvatarProps) => (
  <div
    className={cn(
      "text-md flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-muted-foreground",
      className,
    )}
  >
    <div>{children}</div>
  </div>
);

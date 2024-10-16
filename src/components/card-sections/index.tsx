import Link from "next/link";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CardNameSection({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
              {name}
            </p>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CardCreatedAtSection({ date }: { date: Date }) {
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-xs text-muted-foreground">{format(date, "PP")}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>Creation Date</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CardIdSection({ id, href }: { id: number; href: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className="hidden sm:block">
          <div className="flex cursor-pointer items-center justify-center w-10">
            <p className="text-2xl font-bold text-foreground">
              {id}
            </p>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>ID</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function CardSection({
  text,
  tip,
  href,
}: {
  text: string | null;
  tip: string;
  href?: string;
}) {
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>
              <p className="line-clamp-1 cursor-pointer text-foreground hover:underline">
                {text ?? "N/A"}
              </p>
            </Link>
          ) : (
            <p className="line-clamp-1 text-foreground">{text ?? "N/A"}</p>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CardSubtitleSection({
  subtitle,
  tip,
  href,
}: {
  subtitle: string | null;
  tip: string;
  href?: string;
}) {
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>
              <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
                {subtitle ?? "N/A"}
              </p>
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground">{subtitle ?? "N/A"}</p>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CardBodyEndContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:items-end sm:text-end">{children}</div>
  );
}

export function CardBodyStartContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function CardMenuContainer({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardBodyContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      {children}
    </div>
  );
}

export function CardIndexSection({ index }: { index: number }) {
  return (
    <div className="hidden cursor-pointer items-center justify-center sm:flex">
      <p className="w-10 text-end text-2xl font-bold text-foreground">
        {index}
      </p>
    </div>
  );
}

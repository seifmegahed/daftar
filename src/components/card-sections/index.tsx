import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLocale, getTranslations } from "next-intl/server";
import { getDataLocaleFormat } from "@/utils/common";

const prefetch = false;

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
        <Link href={href} prefetch={prefetch}>
          <TooltipTrigger asChild>
            <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
              {name}
            </p>
          </TooltipTrigger>
        </Link>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export async function CardCreatedAtSection({ date }: { date: Date }) {
  const t = await getTranslations("card-tips");
  const locale = await getLocale();
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-xs text-muted-foreground">
            {format(date, "PP", { locale: getDataLocaleFormat(locale) })}
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("creation-date")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export async function CardIdSection({
  id,
  href,
}: {
  id: number;
  href: string;
}) {
  const t = await getTranslations("card-tips");
  return (
    <Tooltip>
      <Link href={href} prefetch={prefetch} className="hidden sm:block">
        <TooltipTrigger asChild>
          <div className="flex w-10 cursor-pointer items-center justify-center">
            <p className="text-2xl font-bold text-foreground">{id}</p>
          </div>
        </TooltipTrigger>
      </Link>
      <TooltipContent>
        <p>{t("id")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function CardIndexSection({ index }: { index: number }) {
  return (
    <div className="hidden w-10 cursor-pointer items-center justify-center sm:flex">
      <p className="text-2xl font-bold text-foreground">{index}</p>
    </div>
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
        {href ? (
          <Link href={href} prefetch={prefetch}>
            <TooltipTrigger asChild>
              <p className="line-clamp-1 cursor-pointer text-foreground hover:underline">
                {text ?? "N/A"}
              </p>
            </TooltipTrigger>
          </Link>
        ) : (
          <TooltipTrigger asChild>
            <p className="line-clamp-1 text-foreground">{text ?? "N/A"}</p>
          </TooltipTrigger>
        )}
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
        {href ? (
          <Link href={href} prefetch={prefetch}>
            <TooltipTrigger asChild>
              <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
                {subtitle ?? "N/A"}
              </p>
            </TooltipTrigger>
          </Link>
        ) : (
          <TooltipTrigger asChild>
            <p className="text-xs text-muted-foreground">{subtitle ?? "N/A"}</p>
          </TooltipTrigger>
        )}
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

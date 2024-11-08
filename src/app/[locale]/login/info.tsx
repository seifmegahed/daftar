"use client";

import { env } from "@/env";

import Balancer from "react-wrap-balancer";

import { BookmarkIcon } from "@/icons";
import DaftarArabicIcon from "@/icons/daftar-arabic-icon";
import { ChevronDown } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

function LoginInfo({ onScroll }: { onScroll?: () => void }) {
  const locale = useLocale();
  const t = useTranslations("login.info");
  const notArabic = locale !== "ar";
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted lg:h-full">
      <div className="flex h-full w-full max-w-lg flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground lg:h-screen lg:justify-center">
        <div className="flex h-full w-full flex-grow flex-col items-center justify-center gap-4">
          <BookmarkIcon className="h-16 w-16 stroke-secondary-foreground dark:fill-secondary-foreground dark:stroke-none" />
          <DaftarArabicIcon className="stroke-secondary-foreground" />
          <h1 className="mb-4 text-center text-4xl font-bold text-secondary-foreground">
            {t("title", { demo: env.NEXT_PUBLIC_VERCEL })}
          </h1>
          <p>
            <span>
              <Balancer>{t("description")}</Balancer>
            </span>
            {notArabic && (
              <span>
                <Balancer>
                  {t.rich("etymology", {
                    italic: (chunks: unknown) => <i>{chunks as string}</i>,
                    break: () => <br />,
                  })}
                </Balancer>
              </span>
            )}
          </p>
          <p className="hidden lg:block">
            {t("sign-in-section-title-desktop")}
          </p>
          <p className="block lg:hidden">{t("sign-in-section-title-mobile")}</p>
          {env.NEXT_PUBLIC_VERCEL ? (
            <p>
              <Balancer>{t("demo-sign-in-section-description")}</Balancer>
            </p>
          ) : (
            <p>
              <Balancer>{t("sign-in-section-description")}</Balancer>
            </p>
          )}
        </div>
        <div className="flex items-end pb-16 lg:hidden">
          <div onClick={onScroll} className="animate-pulse cursor-pointer" id="scroll-to-bottom">
            <ChevronDown className="h-24 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginInfo;

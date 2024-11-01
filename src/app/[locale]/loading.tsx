import { BookmarkIcon } from "@/icons";
import DaftarArabicIcon from "@/icons/daftar-arabic-icon";
import { getTranslations } from "next-intl/server";
import { env } from "process";

async function MainLoading() {
  const t = await getTranslations("main-loading");
  return (
    <div className="flex h-screen w-screen animate-pulse flex-col items-center justify-center gap-4">
      <BookmarkIcon className="h-16 w-16 stroke-secondary-foreground dark:fill-secondary-foreground dark:stroke-none" />
      <DaftarArabicIcon className="stroke-secondary-foreground" />
      <h1 className="mb-4 text-center text-4xl font-bold text-secondary-foreground">
        {env.NEXT_PUBLIC_VERCEL ? t("title-demo") : t("title")}
      </h1>
    </div>
  );
}

export default MainLoading;

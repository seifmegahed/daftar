import { BookmarkIcon } from "@/icons";
import DaftarArabicIcon from "@/icons/daftar-arabic-icon";
import { env } from "process";

function MainLoading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 animate-pulse">
      <BookmarkIcon className="h-16 w-16 stroke-secondary-foreground dark:fill-secondary-foreground dark:stroke-none" />
      <DaftarArabicIcon className="stroke-secondary-foreground" />
      <h1 className="mb-4 text-center text-4xl font-bold text-secondary-foreground">
        {`Loading Daftar${env.NEXT_PUBLIC_VERCEL ? " Demo" : ""}...`}
      </h1>
    </div>
  );
}

export default MainLoading;

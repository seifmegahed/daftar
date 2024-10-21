import Loading from "@/components/loading";
import { BookmarkIcon } from "@/icons";
import DaftarArabicIcon from "@/icons/daftar-arabic-icon";
import { env } from "process";

function MainLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-full w-full flex-grow flex-col items-center justify-center gap-4">
        <BookmarkIcon className="h-16 w-16 stroke-secondary-foreground dark:fill-secondary-foreground dark:stroke-none" />
        <DaftarArabicIcon className="stroke-secondary-foreground" />
        <h1 className="mb-4 text-center text-4xl font-bold text-secondary-foreground">
          {`Welcome to Daftar ${env.NEXT_PUBLIC_VERCEL ? "Demo" : ""}`}
        </h1>
        <Loading />
      </div>
    </div>
  );
}

export default MainLoading;

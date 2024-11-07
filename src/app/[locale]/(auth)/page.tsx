import { Separator } from "@/components/ui/separator";
import Definitions from "./home-page/definitions";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

export default function Page({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return (
    <div className="mx-auto max-w-5xl space-y-4 pe-56 mb-36">
      <Intro />
      <Definitions />
    </div>
  );
}

async function Intro() {
  const t = await getTranslations("home-page.intro");
  return (
    <div className="py-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Separator className="my-2" />
      <p>{t("description")}</p>
      <p>{t("subtitle")}</p>
    </div>
  );
}

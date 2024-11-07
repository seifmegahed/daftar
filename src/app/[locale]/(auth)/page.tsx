import { Separator } from "@/components/ui/separator";
import Definitions from "./home-page/definitions";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import { Link } from "@/i18n/routing";
import { env } from "@/env";

export default function Page({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return (
    <div className="mx-auto mb-36 max-w-5xl space-y-4 lg:pe-56">
      <Intro />
      {env.NEXT_PUBLIC_VERCEL && <DemoNote />}
      <Definitions />
      <GettingStarted />
    </div>
  );
}

async function DemoNote() {
  const t = await getTranslations("home-page.demo-note");
  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Separator className="my-2" />
      <p>{t("description")}</p>
      <p>{t("documents-description")}</p>
    </div>
  );
}

async function GettingStarted() {
  const t = await getTranslations("home-page.getting-started");

  const links = [
    { label: t("links.projects"), href: "/projects" },
    { label: t("links.clients"), href: "/clients" },
    { label: t("links.suppliers"), href: "/suppliers" },
    { label: t("links.items"), href: "/items" },
    { label: t("links.documents"), href: "/documents" },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Separator className="my-2" />
      <p>{t("description")}</p>
      <ul className="ms-4">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <p>{t("description-2")}</p>
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

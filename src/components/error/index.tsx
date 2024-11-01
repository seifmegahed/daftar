import PokeBoi from "@/icons/poke-boi";
import { getTranslations } from "next-intl/server";
import Balancer from "react-wrap-balancer";

async function ErrorPage({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const t = await getTranslations("error");
  return (
    <div className="flex h-full w-full flex-col items-center gap-4 text-center text-muted-foreground">
      <PokeBoi />
      <h1 className="text-2xl font-bold">
        <Balancer>{title ?? t("title")}</Balancer>
      </h1>
      <p>
        <Balancer>{message}</Balancer>
      </p>
    </div>
  );
}

export default ErrorPage;

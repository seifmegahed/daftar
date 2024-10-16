import PokeBoi from "@/icons/poke-boi";
import Balancer from "react-wrap-balancer";

function ErrorPage({
  title = "Oops! Something went wrong",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-4 text-center text-muted-foreground">
      <PokeBoi />
      <h1 className="text-2xl font-bold">
        <Balancer>{title}</Balancer>
      </h1>
      <p>
        <Balancer>{message}</Balancer>
      </p>
    </div>
  );
}

export default ErrorPage;

"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

const darkUrl = "/poke-dark.png";
const lightUrl = "/poke-light.png";

function ErrorPage({
  title = "Oops! Something went wrong",
  message,
}: {
  title?: string;
  message?: string;
}) {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full flex-col items-center gap-4 text-muted-foreground">
      <Image
        src={theme === "dark" ? darkUrl : lightUrl}
        alt="Poking the dead"
        width={150}
        height={150}
        loading="lazy"
      />
      <h1 className="text-2xl font-bold">{title}</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default ErrorPage;

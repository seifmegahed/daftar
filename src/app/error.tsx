"use client";

import ErrorPage from "@/components/error";

function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage />;
}

export default GlobalError;

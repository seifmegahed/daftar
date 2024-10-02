"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const navigate = useRouter();
  useEffect(() => {
    navigate.push("/projects");
  });
  return <></>;
}

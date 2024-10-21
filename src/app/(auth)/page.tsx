"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const test = false;

export default function Page() {
  const navigate = useRouter();
  useEffect(() => {
    if (test) return;
    navigate.push("/projects");
  });
  return <></>;
}

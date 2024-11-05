"use client";

import { useRef } from "react";
import LoginInfoSection from "./info";
import LoginFormSection from "./form";
import { LanguageButton } from "@/components/buttons";

export default function LoginPage() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="grid h-screen w-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth lg:grid-cols-2">
      <div className="absolute end-6 top-6">
        <LanguageButton />
      </div>
      <div className="snap-center snap-always">
        <LoginInfoSection onScroll={() => ref.current?.scrollIntoView()} />
      </div>
      <div className="snap-center snap-always" ref={ref}>
        <LoginFormSection />
      </div>
    </div>
  );
}

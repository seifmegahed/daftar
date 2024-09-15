"use client";
import { useEffect, useRef } from "react";
import { getInitials } from "@/utils/user";

function PageTitle({ title }: { title: string }) {
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [title]);
  return (
    <div className="flex justify-between p-5" ref={topRef}>
      <h1 className="text-3xl font-bold">{getInitials(title)}</h1>
      <h1 className="text-2xl">{title}</h1>
    </div>
  );
}

export default PageTitle;

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function Page() {
  // const navigate = useRouter();
  // useEffect(() => {
  //   // navigate.push("/projects");
  // });
  const time = new Date(Date.now() + 1000 * 60 * 60 * 2);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{format(time, "pp")}</h1>
    </div>
  );
}

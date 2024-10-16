"use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import Link from "next/link";
// import { env } from "@/env";
import ErrorPage from "@/components/error";

// const errorReport = (error: Error) => `
//                   mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}
//                   ?subject=Error on ${window.location.host + window.location.pathname}
//                   &body=${error.stack}
//                 `;

// function Error({ error, reset }: { error: Error; reset: () => void }) {
//   return (
//     <div className="flex min-h-screen h-full py-10 w-screen items-center justify-center bg-secondary">
//       <Card className="h-fit w-full max-w-screen-sm">
//         <CardHeader className="">
//           <h1 className="text-5xl font-bold text-destructive">Error</h1>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-5 h-full">
//             <h1 className="text-2xl text-destructive w-full">Something went wrong:</h1>
//             <h1 className="text-2xl text-muted-foreground">{error.message}</h1>

//           <div className="-mx-6 overflow-y-scroll text-ellipsis bg-muted p-6 text-muted-foreground max-h-[50vh]">
//             {error.stack}
//           </div>
//           <div className="text-small text-muted-foreground">
//             <p>{"Things can go wrong sometimes, and that's okay."}</p>
//             <p>Maybe try again?</p>
//             <p>{"Or maybe you should go home :)"}</p>
//             <p>
//               Either way, we would appreciate it if you could{" "}
//               <a
//                 className="text-blue-400 hover:underline"
//                 href={errorReport(error)}
//               >
//                 let us know
//               </a>
//             </p>
//           </div>
//           <div className="flex w-full justify-between py-5">
//             <Link href="/">
//               <Button className="h-12 w-48 text-lg" variant="outline">
//                 Go home
//               </Button>
//             </Link>
//             <Button
//               className="h-12 w-48 text-lg"
//               variant="outline"
//               onClick={reset}
//             >
//               Try again
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage />;
}

export default GlobalError;

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { env } from "@/env";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Daftar",
  description: "ERP System",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} scroll-smooth`}
      dir="ltr"
      content="initial-scale=1.0 maximum-scale=1.0"
    >
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <TooltipProvider>
            <BalancerProvider>
              <div className="h-full min-h-screen text-foreground">
                {children}
              </div>
            </BalancerProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
        {env.NEXT_PUBLIC_VERCEL && <Analytics />}
        {env.NEXT_PUBLIC_VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}

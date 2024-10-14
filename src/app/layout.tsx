import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { env } from "@/env";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description: "ERP System",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`} dir="ltr">
      <head />
      <body>
        {env.NEXT_PUBLIC_VERCEL && <Analytics />}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <BalancerProvider>
            <div className="h-full min-h-screen bg-secondary text-foreground">
              {children}
            </div>
          </BalancerProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { env } from "@/env";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMessages } from "next-intl/server";
import { setValidatedLocale } from "@/i18n/set-locale";
import { NextIntlClientProvider } from "next-intl";

import type { Metadata } from "next";
import type { LocaleParams } from "@/i18n/set-locale";

export const metadata: Metadata = {
  title: "Daftar",
  description: "ERP System",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: LocaleParams }>) {
  setValidatedLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} scroll-smooth`}
      dir={direction}
      content="initial-scale=1.0 maximum-scale=1.0"
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
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
                <div className="h-screen text-foreground">{children}</div>
              </BalancerProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
          {env.NEXT_PUBLIC_VERCEL && <Analytics />}
          {env.NEXT_PUBLIC_VERCEL && <SpeedInsights />}
        </body>
      </NextIntlClientProvider>
    </html>
  );
}

import type { Metadata } from "next";
import { CookieConsentManager } from "@/components/cookie-consent-manager";
import { getSiteSettings } from "@/lib/sanity/loaders";
import "./globals.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "In den Boule | Join the legend",
  description:
    "Een multipage horecasite voor In den Boule in Leuven, met menu, events, reservaties, verhuur en cadeaubonnen."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  return (
    <html lang="nl">
      <body>
        {children}
        <CookieConsentManager gtmContainerId={site.gtmContainerId} />
      </body>
    </html>
  );
}

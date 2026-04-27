import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "In den Boule | Join the legend",
  description:
    "Een multipage horecasite voor In den Boule in Leuven, met menu, events, reservaties, verhuur en cadeaubonnen."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

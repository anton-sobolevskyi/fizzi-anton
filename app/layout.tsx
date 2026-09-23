import localFont from "next/font/local";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { ViewCanvas } from "@/components/ui/ViewCanvas";
import { Footer } from "@/components/layout/Footer";

const alpino = localFont({
  src: "../public/fonts/Alpino-Variable.woff2",
  weight: "100 900",
  variable: "--font-alpino",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={alpino.variable}>
      <body className="overflow-x-hidden bg-yellow-300">
        <Header />
        <main>{children}</main>
        <Footer />
        <ViewCanvas />
      </body>
    </html>
  );
}

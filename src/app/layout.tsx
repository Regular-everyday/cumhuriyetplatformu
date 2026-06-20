import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Mersin Cumhuriyet Platformu",
  description:
    "Mersin Cumhuriyet Platformu — Türkiye Cumhuriyeti'ne Sahip Çıkıyoruz! Cumhuriyet değerlerini korumak ve yaşatmak için bir araya geldik.",
  keywords: ["Mersin", "Cumhuriyet", "Platform", "Atatürk", "Sivil Toplum"],
  robots: { index: true, follow: true },
};

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem("mcp-theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${montserrat.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

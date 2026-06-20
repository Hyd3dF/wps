import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

import { getLocale, getTranslator } from "@/lib/i18n";
import { localeOptions } from "@/lib/i18n-shared";

const SITE_URL = "https://oroya.xyz";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getTranslator();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("meta.titleDefault"),
      template: t("meta.titleTemplate"),
    },
    description: t("meta.description"),
    applicationName: "Oroya",
    openGraph: {
      type: "website",
      siteName: "Oroya",
      url: SITE_URL,
      title: t("meta.titleDefault"),
      description: t("meta.description"),
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.titleDefault"),
      description: t("meta.description"),
      creator: "@oroya",
      site: "@oroya",
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0C0C0E",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = localeOptions.find((option) => option.code === locale)?.dir ?? "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <I18nProvider initialLocale={locale}>
          <AppProvider>{children}</AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

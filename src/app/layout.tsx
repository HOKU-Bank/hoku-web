import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { themeBootScript } from "@/components/ThemeSwitcher";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const title = "Hoku Bank | Building the European Innovation Bank";
const description =
  "Agentic banking and credit for Europe's innovators. One account for banking, credit and treasury, run by AI agents within the mandate your CFO sets.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hokubank.com"),
  title,
  description,
  applicationName: "Hoku Bank",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Hoku Bank",
    title,
    description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06060b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {/* desktops render the 3D model; phones and tablets show a still instead */}
        <link rel="preload" href="/models/iphone17pro.glb" as="fetch" crossOrigin="anonymous" media="(min-width: 1024px) and (pointer: fine)" />
        <link rel="preload" href="/models/phone-still.webp" as="image" media="(max-width: 1023px), (pointer: coarse)" />
      </head>
      <body className="min-h-full font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

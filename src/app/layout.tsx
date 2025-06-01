import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { StrongDataProvider } from "@/context/StrongDataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StrongStats – Visualize Your Training Data",
  description:
    "Import your Strong app workouts and view detailed charts, stats, and trends privately and for free.",
  applicationName: "StrongStats",
  authors: [{ name: "Your Name or Alias", url: "https://yourdomain.com" }],
  creator: "Your Name",
  keywords: [
    "Strong app",
    "StrongStats",
    "fitness stats",
    "workout analytics",
    "training charts",
    "csv upload",
    "fitness tracking",
  ],
  openGraph: {
    title: "StrongStats – Visualize Your Training Data",
    description:
      "Import your Strong app workouts and view detailed charts, stats, and trends privately and for free.",
    url: "https://yourdomain.com",
    siteName: "StrongStats",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "StrongStats Chart Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrongStats – Visualize Your Training Data",
    description:
      "Import your Strong app workouts and view detailed charts, stats, and trends privately and for free.",
    creator: "@yourtwitter",
    images: ["https://yourdomain.com/og-image.png"],
  },
  metadataBase: new URL("https://yourdomain.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StrongDataProvider>{children}</StrongDataProvider>
      </body>
    </html>
  );
}

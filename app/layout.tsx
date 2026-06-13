import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./planner.css";

export const metadata: Metadata = {
  title: "InertiaTIV — Planner",
  description: "Digital planner",
  appleWebApp: {
    title: "InertiaTIV",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

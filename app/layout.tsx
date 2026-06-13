import type { Metadata } from "next";
import "./globals.css";
import "./planner.css";

export const metadata: Metadata = {
  title: "InertiaTIV — Planner",
  description: "Digital planner",
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

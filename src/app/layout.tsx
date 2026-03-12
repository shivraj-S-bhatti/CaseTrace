import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaseTrace",
  description:
    "Evidence-backed fraud and compliance review workspace with synthetic cases, rule traces, and audit-ready recommendations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

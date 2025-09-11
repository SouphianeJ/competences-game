import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Competences Game",
  description: "A game to test and develop competences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
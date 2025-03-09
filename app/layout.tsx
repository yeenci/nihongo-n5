import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/font";

export const metadata: Metadata = {
  title: {
    template: '%s | Nihongo N5',
    default: 'Nihongo N5',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}

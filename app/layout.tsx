import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/font";
import AppProvider from "./provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Nihongo N5",
    default: "Nihongo N5",
  },
};

// ensures authentication is available to all pages inside app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

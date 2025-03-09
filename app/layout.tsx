import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/font";
import { AuthProvider } from "./context/AuthContext";

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
        <AuthProvider>
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

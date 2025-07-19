import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuzzBoard",
  description: "Instant polls. Real opinions. No logins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased bg-slate-200`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

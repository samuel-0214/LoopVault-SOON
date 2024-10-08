import type { Metadata } from "next";
import localFont from "next/font/local";
import ".././globals.css";
import { Providers } from "./providers/Providers";
import Navbar from "./components/Navbar/NavBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Loop Vault",
  description: "This is a private party",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

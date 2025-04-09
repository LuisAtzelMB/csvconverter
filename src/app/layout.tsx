import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conversor WordPress a Moodle",
  description: "Convierte usuarios de WordPress a formato Moodle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} bg-gray-50 h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}

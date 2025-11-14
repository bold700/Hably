import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HABLY - High Performance Goal Planner",
  description: "Een digitale High Performance Goal Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  );
}


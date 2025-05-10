import "./globals.css";
import type { Metadata } from "next";

import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";

import Navbar from "@/components/navigation/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = SpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-spaceGrotesk",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        <ThemeProvider
          attribute="class" // 用哪種方式來切換主題的屬性
          defaultTheme="system"
          enableSystem // 是否啟用「跟隨系統主題」的功能
          disableTransitionOnChange // 是否在主題切換時 暫時移除 CSS transition 動畫（避免變色時出現閃爍動畫），然後再加回來
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

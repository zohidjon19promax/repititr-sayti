import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

// Asosiy shriftni sozlaymiz
const inter = Inter({ subsets: ["latin"] });

// Sayt sarlavhasi va tavsifi
export const metadata: Metadata = {
  title: "TutorCenter - O'quv Markazi Boshqaruvi",
  description: "O'qituvchilar va o'quvchilar uchun innovatsion platforma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
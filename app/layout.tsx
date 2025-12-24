import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

// Asosiy shriftni sozlaymiz
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduControl - Premium Dashboard",
  description: "O'qituvchilar va o'quvchilar uchun innovatsion platforma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* Ikonkalar chiqishi uchun FontAwesome linkini qo'shdik */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" // Boshida light mode bo'lishi uchun (xohlasangiz dark qoling)
          enableSystem={true}
          disableTransitionOnChange
        >
          {/* h-screen overflow-hidden saytni qotirib, skrollni chiroyli qiladi */}
          <div className="h-screen overflow-hidden">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
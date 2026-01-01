import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Import yo'lini @ alias orqali ko'rsatish xatolikni oldini oladi
import { ThemeProvider } from "@/components/theme-provider";
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
        {/* Ikonkalar chiqishi uchun FontAwesome linki */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          precedence="default"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={true}
          disableTransitionOnChange
        >
          {/* h-screen overflow-hidden butun sahifa skrollini boshqaradi */}
          <div className="h-screen overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
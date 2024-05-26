import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jottie",
  description: "Generated by create next app",
  // icons: {
  //   icon: [
  //     {
  //       media: "(prefers-color-scheme: light)",
  //       url: "./fav-dark.svg",
  //       href: "./fav-dark.svg",
  //     },
  //     {
  //       media: "(prefers-color-scheme: dark)",
  //       url: "./fav-light.svg",
  //       href: "./fav-light.svg",
  //     },
  //   ],
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="jottie-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/custom/header";
import "./globals.css";
import ShopStatusProvider from "@/contexts/shop-status-context";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Barbershop Queue Management App",
  description: "Barbershop Queue Management App",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ShopStatusProvider>
            <div className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full max-w-7xl flex flex-col gap-20 items-center px-5 lg:px-16">
                <Header />
                <main className="w-full flex flex-col gap-20">{children}</main>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Powered by{" "}
                    <a
                      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Supabase
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </div>
            </div>
          </ShopStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

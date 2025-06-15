import Header from "@/components/custom/header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Header />
        <main className="w-full flex flex-col gap-20">{children}</main>
      </div>
    </div>
  );
}

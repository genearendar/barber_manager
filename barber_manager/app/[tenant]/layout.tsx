// import { headers } from "next/headers";
// import ShopStatusProvider from "@/contexts/shop-status-context";
// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const headersList = await headers();
//   const tenantId = headersList.get("x-tenant-id");
//   return (
//     <ShopStatusProvider tenantId={tenantId}>
//       <div className="min-h-screen flex flex-col items-center">
//         <div className="flex-1 w-full max-w-7xl flex flex-col gap-20 items-center px-5 lg:px-16">
//           <main className="w-full flex flex-col gap-20">
//             This is a shop specific page
//             {children}
//           </main>
//         </div>
//       </div>
//     </ShopStatusProvider>
//   );
// }
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchTenant } from "@/utils/supabase/queries";
import TenantContextProvider from "@/contexts/tenant-context";
import { ClientTenant } from "@/types/db";
import TenantHeader from "@/components/custom/tenant-header";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantData = await fetchTenant(tenantId);

  if (!tenantData) {
    return redirect("/not-found");
  }
  const tenantClientData: ClientTenant = tenantData && {
    id: tenantData.id,
    name: tenantData.name,
    slug: tenantData.slug,
    settings: tenantData.settings,
  };
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full max-w-7xl flex flex-col gap-20 items-center px-5 lg:px-16">
        <TenantContextProvider tenantData={tenantClientData}>
          <TenantHeader tenant={tenantClientData} />
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
        </TenantContextProvider>
      </div>
    </div>
  );
}

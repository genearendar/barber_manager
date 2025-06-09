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
import { fetchTenant } from "@/utils/supabase/queries";
import { TenantContext } from "@/contexts/tenant-context";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantData = await fetchTenant(tenantId!);
  return (
    <div>
      <TenantContext.Provider value={tenantData}>
        {children}
      </TenantContext.Provider>
    </div>
  );
}

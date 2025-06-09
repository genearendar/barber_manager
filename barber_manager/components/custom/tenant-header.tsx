import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/components/header-auth";
import HeaderNavMobile from "./header-nav-mobile";
import { ClientTenant } from "@/types/db";

export default async function TenantHeader({
  tenant,
}: {
  tenant: ClientTenant;
}) {
  const NAV_LINKS: { name: string; href: string; isPublic: boolean }[] = [
    { name: "Queue", href: "queue", isPublic: true },
    { name: "Admin", href: "admin", isPublic: false },
    { name: "Dashboard", href: "admin/dashboard", isPublic: false },
    { name: "Kiosk", href: "admin/queue-kiosk", isPublic: false },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navItems = NAV_LINKS.map((item) =>
    item.isPublic ? (
      <Link key={item.name} href={item.href}>
        {item.name}
      </Link>
    ) : (
      user && (
        <Link key={item.name} href={item.href}>
          {item.name}
        </Link>
      )
    )
  );
  return (
    <header className="w-full">
      <nav className="flex items-center justify-between border-b border-b-foreground/10 h-16 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>{tenant.name}</Link>
        </div>
        <div className="nav-items hidden md:flex gap-6 lg:gap-16">
          {navItems}
        </div>
        <div className="hidden md:block">
          <HeaderAuth user={user} />
        </div>
        <HeaderNavMobile navLinks={NAV_LINKS} user={user} />
      </nav>
    </header>
  );
}

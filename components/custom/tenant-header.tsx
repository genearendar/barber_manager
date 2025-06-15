import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/components/header-auth";
import HeaderNavMobile from "./header-nav-mobile";
import { ClientTenant } from "@/types/db";
import SmartLink from "@/components/custom/smart-link";

export type SmartNavLink = {
  name: string;
  href: string;
  isPublic: boolean;
  tenantSlug?: string | null | undefined;
}
export default async function TenantHeader({
  tenant,
}: {
  tenant: ClientTenant;
}) {
  const NAV_LINKS: SmartNavLink[] = [
    { name: "Queue", href: `/queue`, isPublic: true, tenantSlug: tenant.slug },
    { name: "Admin", href: `/admin`, isPublic: false, tenantSlug: tenant.slug },
    {
      name: "Dashboard",
      href: `/admin/dashboard`,
      isPublic: false,
      tenantSlug: tenant.slug
    },
    {
      name: "Kiosk",
      href: `/admin/queue-kiosk`,
      isPublic: false,
      tenantSlug: tenant.slug
    },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navItems = NAV_LINKS.map((item) =>
    item.isPublic ? (
      <SmartLink key={item.name} href={item.href} tenantSlug={tenant.slug}>
        {item.name}
      </SmartLink>
    ) : (
      user && (
        <SmartLink key={item.name} href={item.href} tenantSlug={tenant.slug}>
          {item.name}
        </SmartLink>
      )
    )
  );
  return (
    <header className="w-full px-5 lg:px-16 flex flex-col items-center border-b border-b-foreground/10">
      <nav className="w-full max-w-7xl flex items-center justify-between h-16 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <SmartLink href="/" tenantSlug={tenant.slug}>{tenant.name}</SmartLink>
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

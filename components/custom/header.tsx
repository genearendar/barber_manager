import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/components/header-auth";
import HeaderNavMobile from "./header-nav-mobile";

export default async function Header() {
  const NAV_LINKS: { name: string; href: string; isPublic: boolean }[] = [];

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
    ),
  );
  return (
    <header className="w-full">
      <nav className="flex items-center justify-between border-b border-b-foreground/10 h-16 text-sm container max-w-7xl">
        <div className="flex gap-5 items-center font-semibold">
          <Link className="text-lg" href={"/"}>
            MyClipmate
          </Link>
        </div>
      </nav>
    </header>
  );
}

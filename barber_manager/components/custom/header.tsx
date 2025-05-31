import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/components/header-auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full">
      <nav className="flex items-center justify-between border-b border-b-foreground/10 h-16 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Barbershop Manager</Link>
        </div>
        <div className="nav-items flex gap-6 lg:gap-16">
          <Link href="/queue">Queue</Link>
          {user && <Link href="/admin">Staff</Link>}
          {user && <Link href="/admin/dashboard">Dashboard</Link>}
          {user && <Link href="/admin/queue-kiosk">Kiosk</Link>}
        </div>

        <HeaderAuth user={user} />
      </nav>
    </header>
  );
}

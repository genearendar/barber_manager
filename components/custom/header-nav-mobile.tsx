"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import HeaderAuth from "@/components/header-auth";
import { User } from "@supabase/supabase-js";
import SmartLink from "@/components/custom/smart-link";
import { SmartNavLink } from "@/components/custom/tenant-header";

export default function HeaderNavMobile({
  navLinks,
  user,
}: {
  navLinks: SmartNavLink[];
  user: User | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = navLinks.map((item) =>
    item.isPublic ? (
      <SmartLink
        href={item.href}
        tenantSlug={item.tenantSlug}
        onClick={() => setIsOpen(false)}
      >
        {item.name}
      </SmartLink>
    ) : (
      user && (
        <SmartLink
          key={item.name}
          href={item.href}
          tenantSlug={item.tenantSlug}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </SmartLink>
      )
    )
  );
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden">
        <AlignJustify />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">Barbershop manager</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 my-8">{navItems}</div>
        <HeaderAuth user={user} />
      </SheetContent>
    </Sheet>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
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
import Header from "./header";

export default function HeaderNavMobile({
  navLinks,
  user,
}: {
  navLinks: { name: string; href: string; isPublic: boolean }[];
  user: User | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = navLinks.map((item) =>
    item.isPublic ? (
      <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
        {item.name}
      </Link>
    ) : (
      user && (
        <Link href={item.href} onClick={() => setIsOpen(false)}>
          {item.name}{" "}
        </Link>
      )
    )
  );
  console.log("is open: ", isOpen);
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

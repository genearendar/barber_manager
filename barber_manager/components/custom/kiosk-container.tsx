"use client";
import { useShopStatus } from "@/hooks/use-shop-status";

// Client component wrapper to use shop status context on the page
export default function KioskContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const shopIsOpen = useShopStatus();
  {
    if (shopIsOpen === null) {
      return <p>Loading shop status...</p>;
    } else if (shopIsOpen === "no") {
      return <p>Sorry we're closed</p>;
    } else {
      return children;
    }
  }
}

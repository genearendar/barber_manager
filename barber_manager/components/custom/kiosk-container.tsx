"use client";
import useShopStatus from "@/hooks/use-shop-status";

// Client component wrapper to use shop status context on the page
export default function KioskContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const shopIsOpen = useShopStatus();
  console.log("Shop status in kiosk:", shopIsOpen);
  {
    if (shopIsOpen === null) {
      return <p>Loading shop status...</p>;
    } else if (!shopIsOpen) {
      return <p>Sorry we're closed</p>;
    } else {
      return children;
    }
  }
}

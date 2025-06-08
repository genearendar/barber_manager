"use client";
import { useState } from "react";
import { toggleShopStatus } from "@/utils/supabase/actions";
import useShopStatus from "@/hooks/use-shop-status";
import useAsyncAction from "@/hooks/use-async-action";
import { Button } from "../ui/button";

export default function OpenCloseShopButton() {
  const shopIsOpen = useShopStatus();
  const {
    execute: handleToggle,
    isLoading,
    isSuccess,
    message,
  } = useAsyncAction(toggleShopStatus);

  // const handleToggle = async () => {
  //   if (isLoading) return;
  //   setIsLoading(true);
  //   setMessage(null);

  //   try {
  //     const result = await toggleShopStatus();

  //     if (result.success) {
  //       setMessage(result.message); // Success message
  //       // Message will auto-clear when context updates
  //       setTimeout(() => setMessage(null), 1000);
  //     } else {
  //       setMessage(result.message); // Error message
  //     }
  //   } catch (err) {
  //     setMessage("Something went wrong");
  //     console.error("Unexpected error:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // if (shopIsOpen === null) {
  //   return <Button disabled>Loading...</Button>;
  // }

  // const isOpen = shopIsOpen === "yes";

  return (
    <div className="space-y-2">
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={shopIsOpen ? "destructive" : "default"}
        className="min-w-[120px]"
        aria-label={`${shopIsOpen ? "Close" : "Open"} the shop`}
      >
        {isLoading ? "Updating..." : shopIsOpen ? "Close Shop" : "Open Shop"}
      </Button>

      {message && (
        <p
          className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}
          role="alert"
        >
          {message}
        </p>
      )}
    </div>
  );
}

"use client";
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
  console.log("shopIsOpen", shopIsOpen);
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

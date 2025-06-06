"use client";
import Form from "next/form";
import { useActionState, useState, useEffect } from "react";
import { addToQueue } from "@/utils/supabase/actions";
import KioskBarberSelect from "./kiosk-barber-select";
import { Barber } from "@/types/db";
import { Button } from "../ui/button";
import { cn } from "@/utils/utils";
export default function KioskForm({ allStaff }: { allStaff: Barber[] | null }) {
  const [formState, handleSave, isLoading] = useActionState(addToQueue, null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  console.log("Is visible", isVisible);
  useEffect(() => {
    if (!formState) return;
    formState && setIsVisible(true);

    const timer = setTimeout(() => {
      // Clear message after 3s
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [formState]);
  return (
    <Form action={handleSave} className="bg-green-100 p-8">
      <label htmlFor="name" className="mb-4">
        Please enter your name:
      </label>
      <input
        name="name"
        placeholder="John"
        className="w-full mt-2 mb-6 p-2"
        required
      />
      <KioskBarberSelect initialStaff={allStaff} />

      <Button type="submit" aria-disabled={isLoading} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Join the queue"}
      </Button>
      {isVisible && (
        <p className={cn("mt-4", formState?.success ? "text-green-500" : "text-red-500")}>
          {formState?.message}
        </p>
      )}
    </Form>
  );
}

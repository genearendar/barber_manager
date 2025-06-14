"use client";
import { useFormState } from "react-dom";
import { createTenant } from "@/utils/supabase/actions";

export default function OnboardingPage() {
  const [state, formAction] = useFormState(createTenant, { message: null });

  return (
    <div className="max-w-md mx-auto mt-12 p-4 border rounded-xl shadow">
      <OnboardingForm />
      <h1 className="text-2xl font-bold mb-4">
        Welcome to MyClipmate, mate! 👋
      </h1>
      <p className="mb-6 text-gray-600">
        Let's get your barbershop set up in just a minute.
      </p>
    </div>
  );
}

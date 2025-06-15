"use client";
import OnboardingForm from "@/components/custom/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="max-w-md mx-auto mt-12 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to MyClipmate, mate! 👋
      </h1>
      <p className="mb-6 text-gray-600">
        Let's get your barbershop set up in just a minute.
      </p>
      <OnboardingForm />
    </div>
  );
}

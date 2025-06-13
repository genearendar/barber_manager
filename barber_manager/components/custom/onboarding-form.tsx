"use client";

export default function OnboardingForm() {
  const [state, formAction] = useFormState(createTenant, { message: null });
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Barbershop name</label>
        <input
          name="name"
          type="text"
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Choose your unique link
        </label>
        <div className="flex items-center mt-1">
          <span className="text-gray-500">https://</span>
          <input
            name="slug"
            type="text"
            required
            pattern="[a-z0-9\-]{3,}"
            title="Lowercase letters, numbers, and hyphens only"
            className="border rounded px-3 py-2 flex-1"
          />
          <span className="text-gray-500 ml-1">.myclipmate.com</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Lowercase letters, numbers, and dashes only.
        </p>
      </div>

      {state.message && <p className="text-red-600 text-sm">{state.message}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        🚀 Finish Setup
      </button>
    </form>
  );
}

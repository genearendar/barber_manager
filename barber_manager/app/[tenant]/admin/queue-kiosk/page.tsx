import { addToQueue } from "@/utils/supabase/actions";
import { SubmitButton } from "@/components/submit-button";
import Form from "next/form";
import KioskContainer from "@/components/custom/kiosk-container";
import KioskForm from "@/components/custom/kiosk-form";
import { getAllCurrentStaff } from "@/utils/supabase/queries";
export default async function QueueKioskPage() {
  const allStaff = await getAllCurrentStaff();

  return (
    <div className="w-full max-w-7xl flex justify-center">
      <div className="w-xl">
        <h1 className="text-3xl text-center mb-4">Welcome!</h1>
        <KioskContainer>
          <KioskForm allStaff={allStaff} />
        </KioskContainer>
      </div>
    </div>
  );
}

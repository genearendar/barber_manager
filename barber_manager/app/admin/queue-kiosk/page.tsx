import { addToQueue } from "@/utils/supabase/actions";
import { SubmitButton } from "@/components/submit-button";
import Form from "next/form";
import KioskContainer from "@/components/custom/kiosk-container";
import KioskBarberSelect from "@/components/custom/kiosk-barber-select";
import { getAllCurrentStaff } from "@/utils/supabase/queries";
export default async function QueueKioskPage() {
  const allStaff = await getAllCurrentStaff();
  return (
    <div className="flex justify-center">
      <div className="w-xl">
        <h1 className="text-3xl text-center mb-4">Welcome!</h1>
        <KioskContainer>
          <Form action={addToQueue} className="bg-green-100 p-8">
            <label htmlFor="name" className="mb-4">
              Please enter your name:
            </label>
            <input
              name="name"
              placeholder="John"
              className="w-full mt-2 mb-6 p-2"
              required
            />
            <KioskBarberSelect initialStaff={allStaff}/>

            <SubmitButton pendingText="Adding to the queue...">
              Join the queue
            </SubmitButton>
          </Form>
        </KioskContainer>
      </div>
    </div>
  );
}

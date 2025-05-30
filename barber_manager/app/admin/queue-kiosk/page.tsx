import { addToQueue } from "@/utils/supabase/actions";
import { SubmitButton } from "@/components/submit-button";
import Form from "next/form";
export default async function QueueKioskPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1>Add your name here form</h1>
        <Form action={addToQueue} className="bg-green-100 p-4">
          <label htmlFor="name" className="mb-4">
            Please enter your name:
          </label>
          <input
            name="name"
            placeholder="John"
            className="w-full mt-2 mb-4"
            required
          />
          <SubmitButton pendingText="Adding to the queue...">
            Join the queue
          </SubmitButton>
        </Form>
      </div>
    </div>
  );
}

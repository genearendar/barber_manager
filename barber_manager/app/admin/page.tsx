import { createClient } from "@/utils/supabase/server";
import { getAllCurrentStaff } from "@/utils/supabase/queries";
import AdminStaffContainer from "@/components/custom/admin-staff-container";
import { toggleShopStatus } from "@/utils/supabase/actions";
import { use, useContext } from "react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const staffData = await getAllCurrentStaff();
  const staffElements = staffData?.map((staff) => (
    <AdminStaffContainer key={staff.id} staff={staff} />
  ));
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1>Main admin page. Content TBD</h1>
      <form action={toggleShopStatus}>
        <button type="submit">Toggle shop status</button>
      </form>

      {staffElements}
    </div>
  );
}

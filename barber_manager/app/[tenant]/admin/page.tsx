import { createClient } from "@/utils/supabase/server";
import { getAllCurrentStaff } from "@/utils/supabase/queries";
import AdminStaffEntry from "@/components/custom/admin-staff-entry";
import OpenCloseShopButton from "@/components/custom/open-close-shop-button";
import { get } from "http";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const staffData = await getAllCurrentStaff();
  const staffElements = staffData?.map((staff) => (
    <AdminStaffEntry key={staff.id} staff={staff} />
  ));
  return (
    <div className="w-full max-w-7xl flex flex-col gap-12">
      <h1>Main admin page. Content TBD</h1>
      <OpenCloseShopButton />
      {staffElements}
    </div>
  );
}

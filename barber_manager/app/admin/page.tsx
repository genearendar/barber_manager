import { createClient } from "@/utils/supabase/server";
import { getAllCurrentStaff } from "@/utils/supabase/queries";
import AdminStaffContainer from "@/components/custom/admin-staff-container";
import OpenCloseShopButton from "@/components/custom/open-close-shop-button";

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
      <OpenCloseShopButton/>
      {staffElements}
    </div>
  );
}

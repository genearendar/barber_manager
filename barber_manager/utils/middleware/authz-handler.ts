import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Helper for checking if user belongs to tenant (implement based on your DB schema)
// This could be moved to a shared server utility.
async function checkIfUserBelongsToTenant(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // In this specific helper, we're not dealing with request cookies
          // in the same way as auth, so returning an empty array is fine
          // as we're just doing a server-to-server query.
          return [];
        },
        setAll(cookiesToSet) {
          // Similarly, no cookies need to be set on the response here
          // as this is a read-only check.
        },
      },
    }
  );

  const { data: userTenantMapping, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    console.error("Error checking user-tenant relationship:", error);
    return false; // Treat as unauthorized on error
  }
  return !!userTenantMapping; // Returns true if a record is found
}

export const authorizationHandler = async (
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> => {
  const currentUserId = response.headers.get("x-user-id"); // User ID from authHandler
  const currentTenantId = response.headers.get("x-tenant-id"); // Tenant ID from tenantHandler
  const currentTenantSlug = response.headers.get("x-tenant-slug"); // Tenant slug from tenantHandler
  const path = request.nextUrl.pathname;

  // Only run authorization checks if both user and tenant are identified
  // and the route is an admin route (or other route requiring tenant-specific auth)
  const isAdminRoute = path.match(/^\/[^/]+\/admin(\/.*)?$/); // Admin route pattern

  if (isAdminRoute && currentUserId && currentTenantId) {
    const userBelongsToTenant = await checkIfUserBelongsToTenant(
      currentUserId,
      currentTenantId
    );

    if (!userBelongsToTenant) {
      console.warn(
        `User ${currentUserId} is not authorized for tenant ${currentTenantId} on admin route. Redirecting.`
      );
      // Redirect to a specific unauthorized page or the sign-in page with an error.
      return NextResponse.redirect(
        new URL(`/${currentTenantSlug}/unauthorized`, request.url)
      );
    }
  }

  // If no authorization issue, pass the response along.
  return response;
};

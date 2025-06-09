import { updateSession, getCurrentTenantId } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a tenant-specific route
  const isTenantRoute =
    pathname.startsWith("/") &&
    pathname !== "/" &&
    pathname !== "/error" &&
    !pathname.startsWith("/tenant-select");

  // in prod: pathname.match(/^\/[^\/]+\/(dashboard|queue|kiosk)/)

  let response = await updateSession(request);

  // Only resolve tenant for tenant routes
  if (isTenantRoute) {
    const tenantResponse = await getCurrentTenantId(request);
    // If the tenantId response is a redirect, return it
    if (tenantResponse.status >= 300 && tenantResponse.status < 400) {
      return tenantResponse;
    }
    // If the tenantId response is successful, set the header
    const tenantId = tenantResponse.headers.get("x-tenant-id");
    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Only run on actual pages, not assets
    "/((?!api|_next|favicon.ico|.*\\.).*)",
  ],
};

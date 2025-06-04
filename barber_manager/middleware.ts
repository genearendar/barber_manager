import { updateSession, getCurrentTenantId } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("--- MAIN MIDDLEWARE START ---");
  console.log("Request URL:", request.url);
  // Always resolve tenant first (needed for all pages)
  let response = await getCurrentTenantId(request);

  // Update session
  const sessionResponse = await updateSession(request);

  // Copy tenant ID to session response
  const tenantId = response.headers.get("x-tenant-id");
  if (tenantId) {
    sessionResponse.headers.set("x-tenant-id", tenantId);
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    // TODO: Refine this matcher before deploying to production to exclude static assets
    "/((?!api).*)", // A simple matcher for now, will be replaced later
  ],
};

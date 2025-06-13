import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// This handler will return a NextResponse (redirect or next) if it performs an action,
// otherwise it will just return NextResponse.next() or pass along the existing response.
export const tenantHandler = async (
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> => {
  const hostname = request.headers.get("host") || "";
  const isLocalOrPreview =
    hostname.startsWith("localhost") || hostname.endsWith(".vercel.app");
  let tenantSlug: string | null = null;

  // Use subdomain in production
  if (!isLocalOrPreview && hostname.endsWith(".myclipmate.com")) {
    tenantSlug = hostname.replace(".myclipmate.com", "");
  } else {
    // Fall back to dynamic route in dev
    const pathSegments = request.nextUrl.pathname.split("/");
    tenantSlug = pathSegments[1] || null;
  }
  if (
    !isLocalOrPreview &&
    request.nextUrl.pathname.startsWith(`/${tenantSlug}/`)
  ) {
    const newUrl = request.nextUrl.clone();
    newUrl.hostname = `${tenantSlug}.myclipmate.com`;
    newUrl.pathname = newUrl.pathname.replace(`/${tenantSlug}`, "");
    return NextResponse.redirect(newUrl);
  }

  // Define specific routes that should resolve a tenant.
  // This pattern matches /<slug>/anything (e.g., /tenant1/dashboard, /tenant2/queue)
  // but excludes top-level non-tenant routes (/, /error, /sign-in, /not-found, /tenant-select)
  const isTenantSpecificAppRoute = request.nextUrl.pathname.match(
    /^\/[^/]+\/(dashboard|queue|queue-kiosk|admin|unauthorized)(\/.*)?$/
  ); // Tenant-specific route pattern

  // If not a tenant-specific route, just pass the response along.
  // This avoids unnecessary DB queries for public pages.
  if (!isTenantSpecificAppRoute) {
    return response;
  }

  // If it's a tenant-specific route but no slug is found (shouldn't happen with regex, but good for safety)
  if (!tenantSlug) {
    console.warn(
      `Tenant-specific route matched but no slug found: ${request.nextUrl.pathname}. Redirecting to /not-found.`
    );
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // No cookie modification for this read
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", tenantSlug)
    .single();

  if (error || !data) {
    console.warn(
      `Tenant not found for slug: ${tenantSlug}. Redirecting to /not-found.`
    );
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // If tenant is found, set the headers on the provided response object
  response.headers.set("x-tenant-id", data.id);
  response.headers.set("x-tenant-slug", tenantSlug);

  // Return the response with added tenant headers for the next handler.
  return response;
};

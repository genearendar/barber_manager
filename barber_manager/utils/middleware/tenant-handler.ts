import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const TENANT_ROUTES =
  /^\/(?:[^/]+\/)?(dashboard|queue|queue-kiosk|admin|unauthorized)(?:\/.*)?$/;

export const tenantHandler = async (
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> => {
  const hostname = request.headers.get("host") || "";
  const isLocalOrPreview =
    hostname.startsWith("localhost") ||
    hostname.endsWith(".vercel.app") ||
    hostname.includes("127.0.0.1");

  // Early exit: Not a tenant-specific route
  if (!TENANT_ROUTES.test(request.nextUrl.pathname)) {
    return response;
  }

  // If on subdomain, rewrite internally to dynamic route
  if (!isLocalOrPreview && hostname.endsWith(".myclipmate.com")) {
    const tenantSlug = hostname.replace(".myclipmate.com", "");
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${tenantSlug}${request.nextUrl.pathname}`;

    return NextResponse.rewrite(newUrl);
  }

  // STEP 2: Extract tenant slug
  const tenantSlug = extractTenantSlug(request, isLocalOrPreview);

  if (!tenantSlug) {
    console.warn(`No tenant slug found for: ${request.nextUrl.pathname}`);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // STEP 3: Validate tenant exists
  try {
    const tenantId = await validateTenant(tenantSlug, request);

    if (!tenantId) {
      console.warn(`Tenant not found: ${tenantSlug}`);
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // STEP 4: Add tenant headers to response
    response.headers.set("x-tenant-id", tenantId);
    response.headers.set("x-tenant-slug", tenantSlug);

    return response;
  } catch (error) {
    console.error(`Tenant validation error for ${tenantSlug}:`, error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
};

function extractTenantSlug(
  request: NextRequest,
  isLocalOrPreview: boolean
): string | null {
  const hostname = request.headers.get("host") || "";

  if (!isLocalOrPreview && hostname.endsWith(".myclipmate.com")) {
    // Production subdomain: tenant1.myclipmate.com → tenant1
    return hostname.replace(".myclipmate.com", "");
  }

  // Local/preview dynamic route: /tenant1/dashboard → tenant1
  const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
  return pathSegments[0] || null;
}

async function validateTenant(
  slug: string,
  request: NextRequest
): Promise<string | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Read-only operation
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}

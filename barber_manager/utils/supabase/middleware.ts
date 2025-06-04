import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Helper function for tenant resolution
async function resolveTenant(request: NextRequest, response: NextResponse) {
  console.log("--- Resolving Tenant ---");
  const SLUG = "rollestonhaircuts"; // fake middleware for now. Get from subdomain later

  if (!SLUG) throw new Error("Missing tenant slug");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op for tenant lookup
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", SLUG)
    .single();

  if (error || !data) throw new Error("Invalid tenant");

  response.headers.set("x-tenant-id", data.id);
}

// Helper function for session management
async function updateSession(request: NextRequest, response: NextResponse) {
  console.log("--- Updating Session ---");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const user = await supabase.auth.getUser();

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/admin") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return null; // No redirect needed
}

// Main middleware function
export default async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // 1. Resolve tenant first
    await resolveTenant(request, response);

    // 2. Handle session and auth
    const authRedirect = await updateSession(request, response);
    if (authRedirect) {
      return authRedirect;
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

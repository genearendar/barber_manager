import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function getCurrentTenantId(req: NextRequest) {
  console.log("--- Fetching current tenant id ---");
  const SLUG = "rollestonhaircuts"; // fake middleware for now. Get from subdomain later

  if (!SLUG) throw new Error("Missing tenant slug");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // In middleware, we don't need to set cookies for this query
          // but we need to provide the interface
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

  const response = NextResponse.next();
  response.headers.set("x-tenant-id", data.id); // Set tenant ID instead of slug

  return response;
}

// Handle auth
export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // protected routes
  if (request.nextUrl.pathname.startsWith("/admin") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
};

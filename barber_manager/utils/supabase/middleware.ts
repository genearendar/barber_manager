import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function getCurrentTenantId(request: NextRequest) {
  const pathSegments = request.nextUrl.pathname.split("/");
  const tenantSlug = pathSegments[1]; // First segment after /

  if (!tenantSlug) throw new Error("Missing tenant slug");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
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
    .eq("slug", tenantSlug)
    .single();
  if (error || !data)
    return NextResponse.redirect(new URL("/error", request.url));

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
  const isProtectedRoute = request.nextUrl.pathname.match(/^\/[^\/]+\/admin/);
  // protected routes
  if (isProtectedRoute && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
};

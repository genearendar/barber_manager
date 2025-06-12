import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// This handler will return a NextResponse (redirect or next) if it performs an action,
// otherwise it will just return NextResponse.next() for the next handler.
export const authHandler = async (
  request: NextRequest
): Promise<NextResponse> => {
  console.log("MW: Auth handler");
  // Create a modifiable response object that will eventually be returned.
  // This ensures cookies set by Supabase are applied to _this_ response.
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
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Store user ID in header for later use by other middleware or server components
  if (user?.id) {
    response.headers.set("x-user-id", user.id);
  } else {
    // If no user, explicitly remove any old user ID header
    response.headers.delete("x-user-id");
  }

  // --- Protected Route Check ---
  // This regex matches /<tenantSlug>/admin or /<tenantSlug>/admin/...
  const isProtectedAdminRoute = request.nextUrl.pathname.match(
    /^\/[^/]+\/admin(\/.*)?$/
  );

  // If on a protected admin route and user is NOT authenticated
  if (isProtectedAdminRoute && userError) {
    console.log(
      "Redirecting unauthenticated user from protected admin route:",
      request.nextUrl.pathname
    );
    // Immediately return a redirect response. No further middleware handlers will run.
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If no specific action (like redirect) was taken, return the response
  // for the next handler to potentially modify.
  return response;
};

import { type NextRequest, NextResponse } from "next/server";
import { authHandler } from "@/utils/middleware/auth-handler";
import { tenantHandler } from "@/utils/middleware/tenant-handler";
import { authorizationHandler } from "@/utils/middleware/authz-handler";

// Array of middleware handlers to run in order
const handlers = [
  authHandler, // Handles authentication, session refresh, general protected routes
  tenantHandler, // Resolves tenant, sets tenant headers
  authorizationHandler, // Handles tenant-specific user authorization
  // Add more handlers here if needed
];

export async function middleware(request: NextRequest) {
  // Start with a clone of the request headers to build the initial response.
  // This ensures the first handler has a response object it can modify.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Iterate through handlers,
  // The key is to ALWAYS use the result of the previous handler as the input
  // for the next one, or for the final return.
  for (const handler of handlers) {
    const handlerResult = await handler(request, response);

    // If the handler returned a new response (e.g., a redirect),
    // immediately return it and stop the chain.
    if (handlerResult && handlerResult.headers.has("Location")) {
      // Check for a redirect explicitly
      return handlerResult;
    }

    // Otherwise, assume the handler has either modified the existing 'response' object
    // or returned a new 'NextResponse.next()' which we should now use.
    // The previous 'response' object is no longer relevant; always use 'handlerResult'.
    response = handlerResult;
  }

  // Return the final response after all handlers have run
  console.log("Final response:", response);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.|sign-in|sign-up|not-found|error|tenant-select).*)",
  ],
};

// A link component that will wrap a link and make it environment aware
// In prod env it will use subdomain otherwise, add a tenant slug if passed
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SmartLink({
  href,
  tenantSlug,
  children,
  onClick, // Keep onClick for client-side interactivity
  ...props // Spread remaining Link props
}: {
  href: string;
  tenantSlug?: string | null | undefined;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & React.ComponentProps<typeof Link>) {
  // Use state to store the determined hostname, initialized to an empty string for SSR.
  // This will be populated once the component mounts in the browser.
  const [currentHost, setCurrentHost] = useState("");

  // Use useEffect to access window.location.host only when the component is mounted in the browser.
  useEffect(() => {
    setCurrentHost(window.location.host);
  }, []); 
  let smartHref: string;

  // Determine if the current environment is a subdomain-based production environment.
  const isSubdomainEnvironment =
    currentHost.endsWith(".myclipmate.com") &&
    currentHost !== "myclipmate.com" &&
    currentHost !== "www.myclipmate.com";

  // Logic to determine the correct href based on environment and tenantSlug
  if (isSubdomainEnvironment) {
    // If we are on a tenant subdomain (e.g., tenant.myclipmate.com)
    // The `href` should be relative to the subdomain (e.g., "/dashboard").
    // We ensure it starts with a '/' for consistency.
    smartHref = href.startsWith("/") ? href : `/${href}`;
  } else {
    // If not in a subdomain environment (e.g., localhost or preview)    
    if (tenantSlug) {
      // Ensure href starts with a slash, then prepend tenantSlug
      const cleanHref = href.startsWith("/") ? href : `/${href}`;
      smartHref = `/${tenantSlug}${cleanHref}`;
    } else {
      // If no tenantSlug is provided (e.g., public pages like /sign-in, /about),
      // just use the original href.
      smartHref = href.startsWith("/") ? href : `/${href}`;
    }
  }

  return (
    <Link href={smartHref} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}

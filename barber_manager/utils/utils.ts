import { redirect } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Barber, QueueEntry } from "@/types/db";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

// Merge classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate wait time for a queue entry
export async function calculateWaitTime(
  avaliableStaff: number | undefined,
  positionInQueue: number
) {
  const AVG_WAIT_TIME = 15; // Average wait time in minutes
  const waitTime =
    avaliableStaff &&
    AVG_WAIT_TIME * Math.ceil((positionInQueue + 1) / avaliableStaff);
  return avaliableStaff ? `${waitTime} minutes` : "no staff available";
}

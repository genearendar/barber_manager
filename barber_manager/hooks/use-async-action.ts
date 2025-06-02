"use client";

import { useState, useCallback } from "react";

// Define a consistent return type for server actions/async functions
interface AsyncActionResult {
  success: boolean;
  message?: string;
  data?: any; // Optional: for returning data on success
}

// Define the shape of the hook's return value
interface AsyncActionHook<
  TArgs extends any[],
  TResult extends AsyncActionResult,
> {
  execute: (...args: TArgs) => Promise<void>; // Allows passing arguments to the action
  isLoading: boolean;
  isSuccess: boolean | null;
  message: string | null;
  data: TResult["data"] | null; // Stores data returned on success
  reset: () => void; // Function to reset the hook's state
}

// Define options for the hook's configuration
interface UseAsyncActionOptions<TResult extends AsyncActionResult> {
  onSuccess?: (data: TResult["data"]) => void; // Callback for successful actions
  onError?: (error: string) => void; // Callback for failed actions
  successMessageDuration?: number; // How long success messages display (0 for no auto-clear)
}

export default function useAsyncAction<
  TArgs extends any[],
  TResult extends AsyncActionResult,
>(
  actionFn: (...args: TArgs) => Promise<TResult>,
  options?: UseAsyncActionOptions<TResult>
): AsyncActionHook<TArgs, TResult> {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<TResult["data"] | null>(null); // State to hold successful data

  // Function to reset the hook's internal state
  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(null);
    setMessage(null);
    setData(null);
  }, []);

  // The main function to execute the async action
  const execute = useCallback(
    async (...args: TArgs) => {
      if (isLoading) return; // Prevent multiple executions if already loading

      setIsLoading(true);
      setIsSuccess(null); // Clear previous success state
      setMessage(null); // Clear previous messages
      setData(null); // Clear previous data

      try {
        const result = await actionFn(...args); // Execute the action with provided arguments
        console.log("Hook result", result);
        if (result.success) {
          setIsSuccess(true);
          setMessage(result.message || "Action completed successfully!");
          setData(result.data || null); // Store any returned data

          // Call the optional onSuccess callback
          options?.onSuccess?.(result.data);

          // Auto-clear success message after a duration, if not disabled
          if (options?.successMessageDuration !== 0) {
            setTimeout(
              () => setMessage(null),
              options?.successMessageDuration || 1000
            ); // Default to 3 seconds
          }
        } else {
          setIsSuccess(false); // Set success state to false
          // Use the error message from the action result, or a generic one
          setMessage(result.message || "An unknown error occurred.");
          // Call the optional onError callback
          options?.onError?.(result.message || "An unknown error occurred.");
        }
      } catch (err) {
        // Catch unexpected errors during the action execution
        console.error("Unexpected error in async action:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Sorry, something went wrong.";
        setMessage(errorMessage);
        // Call the optional onError callback for unexpected errors
        options?.onError?.(errorMessage);
      } finally {
        setIsLoading(false); // Always reset loading state
      }
    },
    [isLoading, actionFn, options]
  ); // Dependencies for useCallback

  return { execute, isLoading, isSuccess, message, data, reset };
}

/**
 * @description
 * ## `useAsyncAction` Hook Documentation
 *
 * This hook simplifies the management of asynchronous operations (like server actions, API calls,
 * or any Promise-based function) in React components. It provides standardized loading states,
 * success/error messages, and callbacks, reducing boilerplate code.
 *
 * It's particularly useful for buttons or form submissions that trigger backend operations.
 *
 * ### How it Works:
 * 1.  **Wraps your action:** You provide an `actionFn` (your server action or async function). The hook wraps this function,
 * adding logic to manage `isLoading`, `isSuccess`, and `message` states automatically.
 * 2.  **State Management:** It internally uses React's `useState` to track the state of the async operation:
 * -   `isLoading`: `true` while the action is running, `false` otherwise.
 * -   `isSuccess`: `true` if the action succeeded, `false` if it failed (either by returning `success: false` or throwing an error), and `null` when idle or reset.
 * -   `message`: A string containing a success or error message from the action.
 * -   `data`: Any data returned by the action on success.
 * 3.  **UI Feedback:** It exposes these states for your component to use for UI feedback (e.g., disabling buttons, showing loaders, displaying messages).
 * 4.  **Error Handling:** It catches potential errors during the action execution, providing a fallback message.
 * 5.  **Callbacks:** Allows you to define `onSuccess` and `onError` functions to run custom logic after the action completes.
 * 6.  **Auto-clearing messages:** Success messages can automatically clear after a set duration for a cleaner UI.
 *
 * ### How to Use It:
 *
 * **1. Define your Async Action (`actionFn`):**
 * Your asynchronous function (e.g., a Next.js Server Action) must return an object with a `success` boolean,
 * and optionally a `message` string and `data` (if successful).
 *
 * ```typescript
 * // Example: app/actions.ts or someAPI.ts
 * export async function saveItem(itemData: { name: string }) {
 * await new Promise(resolve => setTimeout(resolve, 1000));
 * if (Math.random() > 0.1) {
 * return { success: true, message: "Item saved!", data: { id: "abc", ...itemData } };
 * } else {
 * return { success: false, message: "Failed to save item." };
 * }
 * }
 * ```
 *
 * **2. Import and Use in your Client Component:**
 *
 * ```typescript jsx
 * // Example: app/components/MyForm.tsx
 * "use client";
 * import React, { useState } from 'react';
 * import useAsyncAction from '@/hooks/use-async-action'; // Adjust path as needed
 * import { saveItem } from '@/app/actions'; // Your action
 *
 * export default function MyForm() {
 * const [itemName, setItemName] = useState('');
 *
 * // 1. Destructure the hook's returned values
 * const {
 * execute: handleSave,    // The function to call to trigger the action
 * isLoading,           // True when the action is running
 * isSuccess,           // True/False/Null for action outcome
 * message,             // Success/Error message
 * data,                // Data returned on success
 * reset                // Function to reset hook's state
 * } = useAsyncAction(saveItem, { // 2. Pass your async action function
 * // 3. Optional: Configure callbacks and duration
 * onSuccess: (responseData) => {
 * console.log("Successfully saved item with ID:", responseData.id);
 * setItemName(''); // Clear form input
 * },
 * onError: (errorMsg) => {
 * console.error("Error saving item:", errorMsg);
 * },
 * successMessageDuration: 2500 // Show success message for 2.5 seconds
 * });
 *
 * const handleSubmit = async (e: React.FormEvent) => {
 * e.preventDefault();
 * // 4. Call the 'execute' function (renamed to handleSave) with action's arguments
 * await handleSave({ name: itemName });
 * };
 *
 * return (
 * <form onSubmit={handleSubmit}>
 * <input
 * type="text"
 * value={itemName}
 * onChange={(e) => setItemName(e.target.value)}
 * disabled={isLoading}
 * placeholder="Enter item name"
 * />
 * <button type="submit" disabled={isLoading}>
 * {isLoading ? 'Saving...' : 'Save Item'}
 * </button>
 *
 * {message && (
 * <p className={isSuccess ? 'text-green-600' : 'text-red-600'}>
 * {message}
 * </p>
 * )}
 * {data && <p>Saved ID: {data.id}</p>}
 * <button onClick={reset}>Clear Message</buttzon>
 * </form>
 * );
 * }
 * ```
 *
 * @template TArgs - The type of arguments accepted by `actionFn`.
 * @template TResult - The expected return type of `actionFn` (must conform to `AsyncActionResult`).
 * @param {(...args: TArgs) => Promise<TResult>} actionFn - The asynchronous function to execute.
 * @param {object} [options] - Optional configuration for the hook.
 * @param {(data: TResult["data"]) => void} [options.onSuccess] - Callback executed on successful action completion.
 * @param {(error: string) => void} [options.onError] - Callback executed on action failure or unexpected error.
 * @param {number} [options.successMessageDuration] - Duration (in ms) for success messages to display before auto-clearing. Set to `0` to disable auto-clear.
 * @returns {AsyncActionHook<TArgs, TResult>} An object containing:
 * - `execute`: A function to trigger the async action. Pass it the arguments required by `actionFn`.
 * - `isLoading`: `boolean` - `true` when the action is in progress.
 * - `isSuccess`: `boolean | null` - `true` on success, `false` on failure, `null` when idle or reset.
 * - `message`: `string | null` - A message string (success or error).
 * - `data`: `TResult["data"] | null` - Data returned by `actionFn` on success.
 * - `reset`: `() => void` - A function to reset the hook's internal state.
 */

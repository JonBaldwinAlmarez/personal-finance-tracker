import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge conditional className inputs in a Tailwind-friendly way.
 *
 * Uses `clsx` for conditional joining and `tailwind-merge` to resolve conflicts
 * (e.g. `px-2` + `px-4` -> `px-4`).
 *
 * @param {...ClassValue[]} inputs - Any number of conditional class values.
 * @returns {string} A merged className string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

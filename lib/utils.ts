import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges and classifies CSS class names
 * @param {...ClassValue[]} inputs - An array of class values to be merged and classified
 * @returns {string} A string of merged and classified CSS class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
